import { BehaviorSubject } from "rxjs";
import { cameraConfig, resolutionConfig } from "../config/video.config";
import "tracking";

interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

export class CameraService {
    private static instance: CameraService;

    private static transparent = { r: 0, g: 0, b: 0, a: 0 };
    private static red = { r: 255, g: 0, b: 0, a: 255 };

    private cameraVideoStream: MediaStream;
    private context: CanvasRenderingContext2D;
    private imageAnalyzeInfo$ = new BehaviorSubject<any>(null);

    private constructor() { }

    static getInstance(): CameraService {
        if (!CameraService.instance) {
            CameraService.instance = new CameraService();
        }

        return CameraService.instance;
    }

    public analyzeImageData(
        videoElement: HTMLVideoElement
    ): BehaviorSubject<any> {
        this.initCameraStream(videoElement).then(() => { });

        return this.imageAnalyzeInfo$;
    }

    private async initCameraStream(videoElement: HTMLVideoElement) {
        if (
            "mediaDevices" in navigator &&
            "getUserMedia" in navigator.mediaDevices
        ) {
            this.cameraVideoStream = await navigator.mediaDevices.getUserMedia(
                cameraConfig
            );

            // Set src for DOM video element
            videoElement.srcObject = this.cameraVideoStream;
            videoElement.play();

            // videoTrack = cameraVideoStream.getVideoTracks();

            let canvas = document.createElement("canvas");
            canvas.width = resolutionConfig.width;
            canvas.height = resolutionConfig.height;
            this.context = canvas.getContext("2d");

            setInterval(() => {
                this.capture(videoElement);
            }, 100);
        }
    }

    private capture(videoElement: HTMLVideoElement) {
        const timeStart = performance.now();
        this.context.drawImage(
            videoElement,
            0,
            0,
            resolutionConfig.width,
            resolutionConfig.height
        );

        // WARNING, super slow
        let imageData: ImageData = this.context.getImageData(
            0,
            0,
            resolutionConfig.width,
            resolutionConfig.height
        );

        let regionArray: Uint8ClampedArray = Object.assign(imageData.data);

        let info = "";

        // Extend typings to properly access tracking utility functions
        /* let grayArray = tracking.Image.grayscale(
            imageData.data,
            resolutionConfig.width,
            resolutionConfig.height,
            true
        );
        let corners = tracking.Fast.findCorners(
            grayArray,
            resolutionConfig.width,
            resolutionConfig.height
        );

        for (let i = 0; i < corners.length; i += 2) {
            this.setRGBAForImageArray(
                regionArray,
                CameraService.red,
                corners[i],
                corners[i + 1],
                resolutionConfig.width,
                resolutionConfig.height
            );
        } */

        const timeEnd = performance.now();

        this.imageAnalyzeInfo$.next({
            text: `Calc Time: ${timeEnd - timeStart} // ${info}`,
            array: regionArray,
        });
    }

    private getRGBAFromImageArray(
        imageDataArray: Uint8ClampedArray,
        x: number,
        y: number,
        width: number,
        height: number
    ): RGBA {
        const indices = this.getColorIndicesForCoordinates(x, y, width, height);
        return {
            r: imageDataArray[indices[0]],
            g: imageDataArray[indices[1]],
            b: imageDataArray[indices[2]],
            a: imageDataArray[indices[3]],
        };
    }

    private setRGBAForImageArray(
        imageDataArray: Uint8ClampedArray,
        rgba: RGBA,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        const indices = this.getColorIndicesForCoordinates(x, y, width, height);
        imageDataArray[indices[0]] = rgba.r;
        imageDataArray[indices[1]] = rgba.g;
        imageDataArray[indices[2]] = rgba.b;
        imageDataArray[indices[3]] = rgba.a;
    }

    private getColorIndicesForCoordinates(
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        if (x > width || y > height) {
            return null;
        } else if (x < 0 || y < 0) {
            throw new Error(
                `Negative index values not allowed, x: ${x} / y: ${y}`
            );
        }
        let red = y * (width * 4) + x * 4;
        return [red, red + 1, red + 2, red + 3];
    }
}
