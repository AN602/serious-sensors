import { BehaviorSubject } from "rxjs";

interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

export class CameraModule {
    private cameraConfig: MediaStreamConstraints = {
        video: {
            width: {
                min: 1280,
                ideal: 1920,
                max: 2560,
            },
            height: {
                min: 720,
                ideal: 1080,
                max: 1440,
            },
            facingMode: "environment",
        },
    };

    private cameraVideoStream: MediaStream;

    private context: CanvasRenderingContext2D;

    private $imageAnalyzeInfo = new BehaviorSubject<any>(null);

    private static transparent = { r: 0, g: 0, b: 0, a: 0 };
    private static red = { r: 255, g: 0, b: 0, a: 255 };

    public analyzeImageData(
        videoElement: HTMLVideoElement
    ): BehaviorSubject<any> {
        this.initCameraStream(videoElement).then(() => {});

        return this.$imageAnalyzeInfo;
    }

    private async initCameraStream(videoElement: HTMLVideoElement) {
        if (
            "mediaDevices" in navigator &&
            "getUserMedia" in navigator.mediaDevices
        ) {
            this.cameraVideoStream = await navigator.mediaDevices.getUserMedia(
                this.cameraConfig
            );

            // Set src for DOM video element
            videoElement.srcObject = this.cameraVideoStream;
            videoElement.play();

            // videoTrack = cameraVideoStream.getVideoTracks();

            let canvas = document.createElement("canvas");
            canvas.width = 100;
            canvas.height = 100;
            this.context = canvas.getContext("2d");

            setInterval(() => {
                this.capture(videoElement);
            }, 100);
        }
    }

    private capture(videoElement: HTMLVideoElement) {
        const timeStart = performance.now();
        this.context.drawImage(videoElement, 0, 0, 100, 100);

        // WARNING, super slow
        let imageData: ImageData = this.context.getImageData(0, 0, 100, 100);

        let regionArray: Uint8ClampedArray = Object.assign(imageData.data);

        let info = "";

        for (let i = 0; i < 100; i++) {
            for (let u = 0; u < 100; u++) {
                let matchedNeighbors = this.cornerMask(
                    imageData.data,
                    u,
                    i,
                    100,
                    100
                );
                if (matchedNeighbors.right || matchedNeighbors.bottom) {
                    this.setRGBAForImageArray(
                        regionArray,
                        CameraModule.red,
                        u,
                        i,
                        100,
                        100
                    );
                    info = "neighbor passed";
                } else {
                    this.setRGBAForImageArray(
                        regionArray,
                        CameraModule.transparent,
                        u,
                        i,
                        100,
                        100
                    );
                }
            }
        }

        const timeEnd = performance.now();

        this.$imageAnalyzeInfo.next({
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

    private cornerMask(
        imageDataArray: Uint8ClampedArray,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        const currentPixel = this.getRGBAFromImageArray(
            imageDataArray,
            x,
            y,
            width,
            height
        );
        const rightNeighborPixel = this.getRGBAFromImageArray(
            imageDataArray,
            x + 1,
            y,
            width,
            height
        );
        const bottomNeighborPixel = this.getRGBAFromImageArray(
            imageDataArray,
            x,
            y + 1,
            width,
            height
        );

        let matchedNeighbors = {
            right: false,
            bottom: false,
        };

        if (
            currentPixel.r < 200 &&
            currentPixel.g >= 100 &&
            currentPixel.b >= 100
        ) {
            return matchedNeighbors;
        }

        if (
            rightNeighborPixel.r >= 200 &&
            rightNeighborPixel.g < 100 &&
            rightNeighborPixel.b < 100
        ) {
            matchedNeighbors.right = true;
        }

        if (
            bottomNeighborPixel.r >= 200 &&
            bottomNeighborPixel.g < 100 &&
            bottomNeighborPixel.b < 100
        ) {
            matchedNeighbors.bottom = true;
            /**
             * currentPixel.r + 10 <= bottomNeighborPixel.r &&
            bottomNeighborPixel.r <= currentPixel.r - 10
             */
        }

        return matchedNeighbors;
    }
}
