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
} from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

export class App {
    // URL param parsing
    params = new URLSearchParams(new URL(window.location.href).search.slice(1));
    relative = !!Number(this.params.get("relative"));
    coordinateSystem = this.params.get("coord");

    renderContainer: HTMLDivElement;

    controls: TrackballControls;

    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    model: Mesh;

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
    }

    initCamera() {
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
    }

    initWebSocketConnection(initSensors: boolean) {
        this.socket = new WebSocket("wss://192.168.0.213:8080/api");

        this.socket.onmessage = (event: MessageEvent) => {
            let data = JSON.parse(event.data);

            if (data.orientation) {
                this.model.quaternion.fromArray(data.orientation).inverse();
            }

            if (data.translation) {
                this.model.translateX(data.translation.x / 10);
                this.model.translateY(data.translation.y / 10);
                this.model.translateZ(data.translation.z / 10);
            }

            if (data.position) {
                this.model.position.setX(data.position.x);
                this.model.position.setY(data.position.y);
                this.model.position.setZ(data.position.z);
            }
        };

        this.socket.onopen = (_event) => {
            if (initSensors) {
                this.initSensors();
            } else {
                console.log(`connection initialized without sensors`);
            }
        };

        this.initScene();
        this.renderScene();
    }

    initSensors() {
        this.sensorService
            .getGyroData()
            .pipe(filter((data) => data !== null))
            .subscribe((data: number[]) => {
                this.socket.send(
                    JSON.stringify({
                        orientation: data,
                    })
                );
            });

        this.sensorService
            .getAccelerationData()
            .pipe(filter((data) => data !== null))
            .subscribe((data) => {
                this.socket.send(
                    JSON.stringify({
                        translation: data,
                    })
                );
            });
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

        let geometry = new BoxGeometry(1, 1, 1);

        for (var i = 0; i < geometry.faces.length; i++) {
            geometry.faces[i].color.setHex(Math.random() * 0xffffff);
        }

        let material = new MeshBasicMaterial({
            color: 0xffffff,
            vertexColors: true,
        });
        this.model = new Mesh(geometry, material);
        this.scene.add(this.model);

        this.renderer = new WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);

        this.controls = new TrackballControls(
            this.camera,
            this.renderContainer
        );

        this.controls.target.set(0, 0, 0);

        // this.camera.lookAt(this.scene.position);

        this.renderContainer.appendChild(this.renderer.domElement);

        console.log(this.controls);

        this.controls.addEventListener("start", () => {
            console.log("trackball");
        });

        window.addEventListener(
            "resize",
            () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            },
            false
        );
    }

    renderScene(): void {
        requestAnimationFrame(() => {
            this.renderScene();
        });
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    resetScene(): void {
        if (this.socket) {
            this.socket.send(
                JSON.stringify({
                    position: { x: 0, y: 0, z: 0 },
                })
            );
        }
    }
}
