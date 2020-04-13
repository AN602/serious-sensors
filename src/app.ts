import { SensorService } from "./service/sensorService";
import "./app.css";
import { CameraService } from "./service/cameraService";
import { resolutionConfig } from "./config/video.config";
import { filter } from "rxjs/operators";
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
    // URL param parsing
    params = new URLSearchParams(new URL(window.location.href).search.slice(1));
    relative = !!Number(this.params.get("relative"));
    coordinateSystem = this.params.get("coord");

    renderContainer: HTMLDivElement;

    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    modelOne: Mesh;
    modelTwo: Mesh;

    socket: WebSocket;
    clientId: number;

    videoCamera: HTMLVideoElement;
    infoCanvas: HTMLCanvasElement;
    videoInfo: string;

    context: CanvasRenderingContext2D;

    cameraService = CameraService.getInstance();
    sensorService = SensorService.getInstance();

    constructor() {}

    attached() {
        // Camera control
        this.infoCanvas.width = 100;
        this.infoCanvas.height = 100;
        this.context = this.infoCanvas.getContext("2d");
        let imageData = this.context.getImageData(
            0,
            0,
            resolutionConfig.width,
            resolutionConfig.height
        );

        this.cameraService
            .analyzeImageData(this.videoCamera)
            .pipe(filter((info) => info))
            .subscribe((info: any) => {
                this.videoInfo = info.text;
                imageData.data.set(info.array);
                this.context.putImageData(imageData, 0, 0);
            });

        this.initWebSocketConnection(1);
    }

    initWebSocketConnection(clientId: number) {
        this.clientId = clientId;
        this.socket = new WebSocket("wss://192.168.0.213:8080/api");

        this.socket.onmessage = (event: MessageEvent) => {
            let messageData = JSON.parse(event.data);
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

        this.socket.onopen = (_event) => {
            this.sensorService
                .getGyroData()
                .pipe(filter((data) => data !== null))
                .subscribe((data: number[]) => {
                    this.modelOne.quaternion.fromArray(data).inverse();
                    this.socket.send(
                        JSON.stringify({
                            orientation: data,
                            clientId: 1,
                        })
                    );
                });

            this.sensorService
                .getAccelerationData()
                .pipe(filter((data) => data !== null))
                .subscribe((data) => {
                    console.log(data);
                    this.modelOne.translateX(data.x / 10);
                    this.modelOne.translateY(data.y / 10);
                    this.modelOne.translateZ(data.z / 10);
                });
        };

        this.initScene();
        this.renderScene();
    }

    initScene(): void {
        console.info("init three scene");

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

        this.renderContainer.appendChild(this.renderer.domElement);

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

    renderScene(): void {
        requestAnimationFrame(() => {
            this.renderScene();
        });
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
    }
}
