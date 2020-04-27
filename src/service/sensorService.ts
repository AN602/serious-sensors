import { SensorOrientation } from "./../config/sensor.config";
import { BehaviorSubject } from "rxjs";
import { Vector3, Quaternion } from "three";

export class SensorService {
    private static instance: SensorService;

    private gyroData$ = new BehaviorSubject<Quaternion>(null);
    private accelerationData$ = new BehaviorSubject<Vector3>(null);

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

    getGyroData(): BehaviorSubject<Quaternion> {
        this.initGyroSensor();
        return this.gyroData$;
    }

    getAccelerationData(): BehaviorSubject<Vector3> {
        this.initAccelerometer();
        return this.accelerationData$;
    }

    private async initSensors() {
        if (navigator.permissions) {
            await Promise.all([
                navigator.permissions.query({ name: "magnetometer" }),
                navigator.permissions.query({ name: "gyroscope" }),
                navigator.permissions.query({ name: "accelerometer" }),
            ]);

            this.initAccelerometer();
            this.initGyroSensor();
        } else {
            console.info("No Permissions API, still try to start app.");
        }
    }

    private async initGyroSensor() {
        try {
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
                this.gyroData$.next(
                    new Quaternion(
                        this.gyroSensor.quaternion[0],
                        this.gyroSensor.quaternion[1],
                        this.gyroSensor.quaternion[2],
                        this.gyroSensor.quaternion[3]
                    )
                );
            };

            this.gyroSensor.start();
        } catch (error) {
            console.error(`Error while trying to initialize gyro: ${error}`);
        }
    }

    private async initAccelerometer() {
        try {
            const options = { frequency: 60 };

            this.accelerometer = new LinearAccelerationSensor(options);

            this.accelerometer.onactivate = () => {
                console.info("activate acceleration sensor");
            };

            this.accelerometer.onreading = () => {
                if (!this.gyroData$.value) {
                    return;
                }

                this.accelerationData$.next(
                    new Vector3(
                        this.accelerometer.x,
                        this.accelerometer.y,
                        this.accelerometer.z
                    )
                );
            };

            this.accelerometer.start();
        } catch (error) {
            console.error(
                `Error while trying to initialize accelerometer: ${error}`
            );
        }
    }
}
