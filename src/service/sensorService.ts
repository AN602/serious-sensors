import { SensorOrientation } from "./../config/sensor.config";
import { BehaviorSubject } from "rxjs";

export class SensorService {
    private static instance: SensorService;

    private $gyroData = new BehaviorSubject<number[]>(null);
    private $accelerationData = new BehaviorSubject<any>(null);

    private gyroSensor: RelativeOrientationSensor | AbsoluteOrientationSensor;
    private accelerometer: Accelerometer;
    private relative = SensorOrientation.RELATIVE;

    private constructor() {}

    static getInstance(): SensorService {
        if (!SensorService.instance) {
            SensorService.instance = new SensorService();
        }

        return SensorService.instance;
    }

    getGyroData(): BehaviorSubject<number[]> {
        this.initGyroSensor();
        return this.$gyroData;
    }

    getAccelerationData(): BehaviorSubject<any> {
        this.initAccelerometer();
        return this.$accelerationData;
    }

    private initSensors() {
        if (navigator.permissions) {
            // https://w3c.github.io/orientation-sensor/#model
            Promise.all([navigator.permissions.query({ name: "magnetometer" })])
                .then((results) => {
                    if (results.every((result) => result.state === "granted")) {
                        console.info("permission granted");
                        this.initGyroSensor();
                    } else {
                        console.info("Permission to use sensor was denied.");
                    }
                })
                .catch((err) => {
                    console.info(
                        "Integration with Permissions API is not enabled, still try to start app."
                    );
                });
        } else {
            console.info("No Permissions API, still try to start app.");
        }
    }

    private async initGyroSensor() {
        try {
            await navigator.permissions.query({ name: "gyroscope" });

            const options = { frequency: 60, referenceFrame: "device" };

            this.gyroSensor = this.relative
                ? new AbsoluteOrientationSensor(options)
                : new RelativeOrientationSensor(options);

            this.gyroSensor.onactivate = () => {
                console.info("activate orientation sensor");
            };

            this.gyroSensor.onerror = (event) => {
                console.info("error", event);
            };

            this.gyroSensor.onreading = () => {
                this.$gyroData.next(this.gyroSensor.quaternion);
            };

            this.gyroSensor.start();
        } catch (error) {
            console.error(`Error while trying to initialize gyro: ${error}`);
        }
    }

    private async initAccelerometer() {
        try {
            await navigator.permissions.query({ name: "accelerometer" });

            const options = { frequency: 60 };

            this.accelerometer = new LinearAccelerationSensor(options);

            this.accelerometer.onactivate = () => {
                console.info("activate acceleration sensor");
            };

            this.accelerometer.onreading = () => {
                this.$accelerationData.next({
                    x: this.accelerometer.x,
                    y: this.accelerometer.y,
                    z: this.accelerometer.z,
                });
            };

            this.accelerometer.start();
        } catch (error) {
            console.error(
                `Error while trying to initialize accelerometer: ${error}`
            );
        }
    }
}
