import './app.css';
import {
    AbsoluteOrientationSensor,
    RelativeOrientationSensor
} from 'motion-sensors-polyfill';
import { PerspectiveCamera, Scene, AmbientLight, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, FaceColors } from 'three';

export class App {
    message: string = '';

    params = new URLSearchParams(new URL(window.location.href).search.slice(1));
    relative = !!Number(this.params.get("relative"));
    coordinateSystem = this.params.get("coord");
    container: HTMLDivElement;
    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    model: Mesh;

    orientationSensorensor: RelativeOrientationSensor | AbsoluteOrientationSensor;

    socket: WebSocket;

    constructor() { }

    attached() {

        this.socket = new WebSocket('wss://192.168.68.216:8080/api');

        this.initScene();

        if (navigator.permissions) {
            // https://w3c.github.io/orientation-sensor/#model
            Promise.all([
                navigator.permissions.query({ name: "accelerometer" }),
                navigator.permissions.query({ name: "magnetometer" }),
                navigator.permissions.query({ name: "gyroscope" })
            ])
                .then(results => {
                    if (results.every(result => result.state === "granted")) {
                        console.info("permission granted");
                        this.initSensor();
                    } else {
                        console.info("Permission to use sensor was denied.");
                    }
                }).catch(err => {
                    console.info("Integration with Permissions API is not enabled, still try to start app.");
                    this.initSensor();
                });
        } else {
            console.info("No Permissions API, still try to start app.");
            this.initSensor();
        }

        this.renderScene();
        this.socket.onmessage = (event: MessageEvent) => {
            console.log(event.data);
        };
    }


    initScene(): void {
        console.info('init three scene');
        this.container = document.createElement('div');
        document.querySelector('body').appendChild(this.container);

        this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 200);
        this.camera.position.z = 10;
        this.scene = new Scene();
        var ambientLight = new AmbientLight(0x404040, 6);
        this.scene.add(ambientLight);

        let geometry = new BoxGeometry(1, 1, 1);

        for (var i = 0; i < geometry.faces.length; i++) {
            geometry.faces[i].color.setHex(Math.random() * 0xffffff);
        }

        let material = new MeshBasicMaterial({ color: 0xffffff, vertexColors: FaceColors });
        this.model = new Mesh(geometry, material);
        this.scene.add(this.model);

        this.renderer = new WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);

        // document.addEventListener('mousedown', () => document.documentElement.requestFullscreen());
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement != null) {
                screen.orientation.lock("natural")
            }
        });
    }

    initSensor(): void {
        const options = { frequency: 60, referenceFrame: 'device' };
        console.info(JSON.stringify(options));
        this.orientationSensorensor = this.relative ? new RelativeOrientationSensor(options) : new AbsoluteOrientationSensor(options);
        console.info(this.orientationSensorensor);

        this.orientationSensorensor.onactivate = () => {
            console.info('activate sensor');
        }

        this.orientationSensorensor.onreading = () => {
            console.info("reading sensor");
            this.socket.send(JSON.stringify(this.orientationSensorensor.quaternion));
            this.model.quaternion.fromArray(this.orientationSensorensor.quaternion).inverse();
        };

        this.orientationSensorensor.onerror = (event) => {
            console.info('error', event);
            if (event.error.name == 'NotReadableError') {
                console.info("Sensor is not available.", event);
            }
        };

        this.orientationSensorensor.start();

        window.addEventListener('ondeviceorientation', (event) => {
            console.info('fireing device orientation event', event);
        });
    }

    renderScene(): void {
        console.info('render scene');
        requestAnimationFrame(() => {
            this.renderScene();
        });
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
    }
}
