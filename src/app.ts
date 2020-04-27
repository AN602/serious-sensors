import { SensorService } from "./service/sensorService";
import "./app.css";
import { CameraService } from "./service/cameraService";
import { resolutionConfig } from "./config/video.config";
import { filter } from "rxjs/operators";
import {
    Scene,
    AmbientLight,
    WebGLRenderer,
    Mesh,
    FogExp2,
    MeshPhongMaterial,
    DirectionalLight,
    AxesHelper,
    TorusGeometry,
    BoxGeometry,
    Vector3,
    Quaternion,
    OrthographicCamera,
    Euler,
} from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

export class App {
    // URL param parsing
    params = new URLSearchParams(new URL(window.location.href).search.slice(1));
    relative = !!Number(this.params.get("relative"));
    coordinateSystem = this.params.get("coord");

    renderContainer: HTMLDivElement;

    controls: TrackballControls;

    camera: OrthographicCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    model: Mesh;
    movementElement: Mesh;

    socket: WebSocket;
    clientId: number;

    videoCamera: HTMLVideoElement;
    infoCanvas: HTMLCanvasElement;
    videoInfo: string;

    context: CanvasRenderingContext2D;

    cameraService = CameraService.getInstance();
    sensorService = SensorService.getInstance();

    movementVectorX = new Vector3(1, 0, 0);
    movementVectorY = new Vector3(0, 1, 0);
    movementVectorZ = new Vector3(0, 0, 1);
    movementData = {
        orientation: new Quaternion(1, 0, 0, 0),
        translation: new Vector3(0, 0, 0),
        position: new Vector3(0, 0, 1),
    };

    movementInfo = "";

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
                this.movementData.orientation = new Quaternion(
                    data.orientation._x,
                    data.orientation._y,
                    data.orientation._z,
                    data.orientation._w
                );
            }

            if (data.translation) {
                this.movementData.translation = new Vector3(
                    data.translation.x,
                    data.translation.y,
                    data.translation.z
                );
            }

            if (data.position) {
                this.movementData.position = new Vector3(data.position);
            }
        };

        this.socket.onopen = (_event) => {
            if (initSensors) {
                this.initSensors();
            } else {
                this.initScene();
                this.renderScene();
                console.log(`connection initialized without sensors`);
            }
        };
    }

    initSensors() {
        this.sensorService
            .getGyroData()
            .pipe(filter((data) => data !== null))
            .subscribe((data: Quaternion) => {
                this.socket.send(
                    JSON.stringify({
                        orientation: data,
                    })
                );
            });

        this.sensorService
            .getAccelerationData()
            .pipe(filter((data) => data !== null))
            .subscribe((data: Vector3) => {
                this.socket.send(
                    JSON.stringify({
                        translation: data,
                    })
                );
            });
    }

    initScene(): void {
        console.info("init three scene");

        this.camera = new OrthographicCamera(
            window.innerWidth / -2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            window.innerHeight / -2,
            1,
            1000
        );
        this.camera.position.z = 100;

        this.scene = new Scene();
        // this.scene.background = new Color(0xcccccc);
        this.scene.fog = new FogExp2(0xcccccc, 0.002);

        let geometry = new TorusGeometry(50, 10, 16, 100);
        let movementGeometry = new BoxGeometry(50, 50, 50);

        let material = new MeshPhongMaterial({
            color: 0xffffff,
            flatShading: true,
        });

        this.model = new Mesh(geometry, material);
        this.model.translateX(window.innerWidth / 2 - 150);
        this.model.translateY(window.innerHeight / 2 - 150);
        this.scene.add(this.model);

        this.movementElement = new Mesh(movementGeometry, material);
        this.scene.add(this.movementElement);

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
    }

    private renderScene(): void {
        requestAnimationFrame(() => {
            this.renderScene();
        });
        this.controls.update();
        this.updatePlayerPosition();
        this.renderer.render(this.scene, this.camera);
    }

    private updatePlayerPosition(): void {
        this.model.quaternion.copy(this.movementData.orientation).inverse();

        const xMovement = this.movementVectorY
            .clone()
            .applyQuaternion(this.movementData.orientation);

        const yMovement = this.movementVectorZ
            .clone()
            .applyQuaternion(this.movementData.orientation);

        this.movementElement.translateX(xMovement.x);
        this.movementElement.translateY(yMovement.x);

        this.movementElement.scale.set(xMovement.y, xMovement.y, xMovement.y);

        this.movementInfo =
            `${this.movementData.orientation.x}/${this.movementData.orientation.y}/${this.movementData.orientation.z}/${this.movementData.orientation.w}\n` +
            `moving x: ${xMovement.x} y: ${yMovement.x}`;

        /* this.model.translateX(this.movementData.translation.x / 2);
        this.model.translateY(this.movementData.translation.y / 2);
        this.model.translateZ(this.movementData.translation.z / 2); */

        /* this.model.position.setX(this.movementData.position.x);
        this.model.position.setY(this.movementData.position.y);
        this.model.position.setZ(this.movementData.position.z);

        this.movementElement.position.setX(this.movementData.position.x);
        this.movementElement.position.setY(this.movementData.position.y);
        this.movementElement.position.setZ(this.movementData.position.z); */
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
