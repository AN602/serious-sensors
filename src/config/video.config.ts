export const cameraConfig: MediaStreamConstraints = {
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

export const resolutionConfig = {
    width: 100,
    height: 100,
};
