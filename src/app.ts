import "./app.css";
import { CameraModule } from "./cameraModule";
import { filter } from "rxjs/operators";
import {
    AbsoluteOrientationSensor,
    RelativeOrientationSensor,
} from "motion-sensors-polyfill";
import {
    PerspectiveCamera,
    Scene,
    AmbientLight,
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    FaceColors,
} from "three";

export class App {
    params = new URLSearchParams(new URL(window.location.href).search.slice(1));
    relative = !!Number(this.params.get("relative"));
    coordinateSystem = this.params.get("coord");
    container: HTMLDivElement;
    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    modelOne: Mesh;
    modelTwo: Mesh;

    orientationSensor: RelativeOrientationSensor | AbsoluteOrientationSensor;

    socket: WebSocket;
    clientId: number;

    videoCamera: HTMLVideoElement;
    infoCanvas: HTMLCanvasElement;
    videoInfo: string;

    context: CanvasRenderingContext2D;

    cameraModule = new CameraModule();

    constructor() {}

    attached() {
        this.infoCanvas.width = 100;
        this.infoCanvas.height = 100;
        this.context = this.infoCanvas.getContext("2d");

        this.cameraModule
            .analyzeImageData(this.videoCamera)
            .pipe(filter((info) => info))
            .subscribe((info: any) => {
                this.videoInfo = info.text;
                /* this.context.clearRect(
                    0,
                    0,
                    this.infoCanvas.width,
                    this.infoCanvas.height
                ); */
                let imageData = this.context.getImageData(0, 0, 100, 100);
                imageData.data.set(info.array);
                this.context.putImageData(imageData, 0, 0);
            });

        if (navigator.permissions) {
            // https://w3c.github.io/orientation-sensor/#model
            Promise.all([
                navigator.permissions.query({ name: "accelerometer" }),
                navigator.permissions.query({ name: "magnetometer" }),
                navigator.permissions.query({ name: "gyroscope" }),
            ])
                .then((results) => {
                    if (results.every((result) => result.state === "granted")) {
                        console.info("permission granted");
                        // this.initSensor();
                    } else {
                        console.info("Permission to use sensor was denied.");
                    }
                })
                .catch((err) => {
                    console.info(
                        "Integration with Permissions API is not enabled, still try to start app."
                    );
                    // this.initSensor();
                });
        } else {
            console.info("No Permissions API, still try to start app.");
            // this.initSensor();
        }
    }

    initWebSocketConnection(clientId: number) {
        this.clientId = clientId;
        this.socket = new WebSocket("wss://192.168.12.172:8080/api");

        this.socket.onmessage = (event: MessageEvent) => {
            let messageData = JSON.parse(event.data);
            console.log(messageData);
            if (messageData.clientId != this.clientId) {
                switch (messageData.clientId) {
                    case 1:
                        this.modelOne.quaternion
                            .fromArray(messageData.orientation)
                            .inverse();
                        break;
                    case 2:
                        this.modelTwo.quaternion
                            .fromArray(messageData.orientation)
                            .inverse();
                        break;
                    default:
                        console.warn("unknown client id, updating");
                }
            } else {
                console.warn("do not update own model on message");
            }
        };

        this.initScene();
        this.renderScene();
    }

    initScene(): void {
        console.info("init three scene");
        this.container = document.createElement("div");
        document.querySelector("body").appendChild(this.container);

        this.camera = new PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            1,
            200
        );
        this.camera.position.z = 10;
        this.scene = new Scene();
        var ambientLight = new AmbientLight(0x404040, 6);
        this.scene.add(ambientLight);

        let geometryOne = new BoxGeometry(1, 1, 1);
        let geometryTwo = new BoxGeometry(1, 1, 1);

        for (var i = 0; i < geometryOne.faces.length; i++) {
            geometryOne.faces[i].color.setHex(Math.random() * 0xffffff);
        }

        for (var i = 0; i < geometryTwo.faces.length; i++) {
            geometryTwo.faces[i].color.setHex(Math.random() * 0xffffff);
        }

        let material = new MeshBasicMaterial({
            color: 0xffffff,
            vertexColors: FaceColors,
        });
        this.modelOne = new Mesh(geometryOne, material);
        this.scene.add(this.modelOne);

        this.modelTwo = new Mesh(geometryTwo, material);
        this.scene.add(this.modelTwo);
        this.modelTwo.position.y = this.modelTwo.position.y - 2;

        this.renderer = new WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener(
            "resize",
            () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            },
            false
        );

        // document.addEventListener('mousedown', () => document.documentElement.requestFullscreen());
        document.addEventListener("fullscreenchange", () => {
            if (document.fullscreenElement != null) {
                screen.orientation.lock("natural");
            }
        });
    }

    initSensor(): void {
        const options = { frequency: 60, referenceFrame: "device" };
        console.info(JSON.stringify(options));
        this.orientationSensor = this.relative
            ? new RelativeOrientationSensor(options)
            : new AbsoluteOrientationSensor(options);
        console.info(this.orientationSensor);

        this.orientationSensor.onactivate = () => {
            console.info("activate sensor");
        };

        this.orientationSensor.onreading = () => {
            console.info("reading sensor");
            this.socket.send(
                JSON.stringify({
                    orientation: this.orientationSensor.quaternion,
                    clientId: this.clientId,
                })
            );
            switch (this.clientId) {
                case 1:
                    this.modelOne.quaternion
                        .fromArray(this.orientationSensor.quaternion)
                        .inverse();
                    break;
                case 2:
                    this.modelTwo.quaternion
                        .fromArray(this.orientationSensor.quaternion)
                        .inverse();
                    break;
                default:
                    console.warn("wrong client id");
            }
        };

        this.orientationSensor.onerror = (event) => {
            console.info("error", event);
            if (event.error.name == "NotReadableError") {
                console.info("Sensor is not available.", event);
            }
        };

        this.orientationSensor.start();

        window.addEventListener("ondeviceorientation", (event) => {
            console.info("fireing device orientation event", event);
        });
    }

    renderScene(): void {
        console.info("render scene");
        requestAnimationFrame(() => {
            this.renderScene();
        });
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
    }
}
