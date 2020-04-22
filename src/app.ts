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
    Mesh,
    FogExp2,
    MeshPhongMaterial,
    DirectionalLight,
    AxesHelper,
    TorusGeometry,
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

    constructor() { }

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

        this.socket = new WebSocket("wss://192.168.0.130:8080/api");

        this.socket.onmessage = (event: MessageEvent) => {
            let data = JSON.parse(event.data);

            if (data.orientation) {
                this.model.quaternion.fromArray(data.orientation).inverse();
            }

            if (data.translation) {
                // rotate
                this.model.translateX(data.translation.x / 2);
                this.model.translateY(data.translation.y / 2);
                this.model.translateZ(data.translation.z / 2);
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

        let aspect = window.innerWidth / window.innerHeight;

        this.camera = new PerspectiveCamera(60, aspect, 0.1, 2000);
        this.camera.position.y = 100;

        this.scene = new Scene();
        // this.scene.background = new Color(0xcccccc);
        this.scene.fog = new FogExp2(0xcccccc, 0.002);

        let geometry = new TorusGeometry(10, 3, 16, 100);

        let material = new MeshPhongMaterial({
            color: 0xffffff,
            flatShading: true,
        });

        this.model = new Mesh(geometry, material);
        this.scene.add(this.model);

        let axesHelper = new AxesHelper(5);
        this.scene.add(axesHelper);

        // lights
        let light_1 = new DirectionalLight(0xffffff);
        light_1.position.set(1, 1, 1);
        this.scene.add(light_1);

        let light_2 = new DirectionalLight(0x002288);
        light_2.position.set(-1, -1, -1);
        this.scene.add(light_2);

        let light_3 = new AmbientLight(0x222222);
        this.scene.add(light_3);

        this.renderer = new WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.controls = new TrackballControls(
            this.camera,
            this.renderer.domElement
        );

        this.renderContainer.appendChild(this.renderer.domElement);

        this.controls.handleResize();

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
