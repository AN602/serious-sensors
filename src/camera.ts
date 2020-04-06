const cameraConfig: MediaStreamConstraints = {
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

let cameraVideoStream: MediaStream;
// let videoTrack: MediaStreamTrack[];
let context: CanvasRenderingContext2D;

export async function initCameraStream(
    videoElement: HTMLVideoElement
): Promise<string> {
    if (
        "mediaDevices" in navigator &&
        "getUserMedia" in navigator.mediaDevices
    ) {
        cameraVideoStream = await navigator.mediaDevices.getUserMedia(
            cameraConfig
        );

        // Set src for DOM video element
        videoElement.srcObject = cameraVideoStream;
        videoElement.play();

        // videoTrack = cameraVideoStream.getVideoTracks();

        let canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 480;
        let context = canvas.getContext("2d");

        setInterval(() => capture(videoElement)), 100);

        return "JSON.stringify(videoTrack)";
    }
}

function capture(videoElement: HTMLVideoElement) {
    context.drawImage(videoElement, 0, 0, 640, 480);

    // do other stuff
}
