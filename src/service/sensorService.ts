import { UnitQuaternion } from './../utils/quaternion';
import { SensorOrientation } from "./../config/sensor.config";
import { BehaviorSubject } from "rxjs";

export class SensorService {
    private static instance: SensorService;

    private gyroData$ = new BehaviorSubject<number[]>(null);
    private accelerationData$ = new BehaviorSubject<any>(null);

    private gyroSensor: RelativeOrientationSensor | AbsoluteOrientationSensor;
    private accelerometer: Accelerometer;
    private relative = SensorOrientation.RELATIVE;

    private constructor() { }

    static getInstance(): SensorService {
        if (!SensorService.instance) {
            SensorService.instance = new SensorService();
        }

        return SensorService.instance;
    }

    getGyroData(): BehaviorSubject<number[]> {
        this.initGyroSensor();
        return this.gyroData$;
    }

    getAccelerationData(): BehaviorSubject<any> {
        this.initAccelerometer();
        return this.accelerationData$;
    }

    private async initSensors() {
        if (navigator.permissions) {
            await Promise.all([
                navigator.permissions.query({ name: "magnetometer" }),
                navigator.permissions.query({ name: "gyroscope" }),
                navigator.permissions.query({ name: "accelerometer" })
            ])

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
                this.gyroData$.next(this.gyroSensor.quaternion);
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
                const unitQuaternion = UnitQuaternion.fromArray(this.gyroData$.value);
                const accelerationVector = [this.accelerometer.x, this.accelerometer.y, this.accelerometer.z];
                const rotatedVector = UnitQuaternion.rotateVectorByQuaternion(accelerationVector, unitQuaternion);
                this.accelerationData$.next({
                    x: rotatedVector[0],
                    y: rotatedVector[1],
                    z: rotatedVector[2],
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
