import {
    useEffect,
    useRef,
} from "react";

async function setupCamera(video) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
            'audio': false,
            'video': true
        });
        video.srcObject = stream;

        return new Promise(resolve => {
            video.onloadedmetadata = () => {
                console.log(video.videoWidth, video.videoHeight);
                resolve(video);
            };
        });
    } else {
        const errorMessage = "This browser does not support video capture, or this device does not have a camera";
        alert(errorMessage);
        return Promise.reject(errorMessage);
    }
}

function CameraVideo({ width, height, doLoad, readyCallback }) {
    const videoRef = useRef();

    useEffect(() => {
        if (!doLoad) return;
        const video = videoRef.current;
        async function load() {
            await setupCamera(video);
            video.play();

            readyCallback(video);
        }
        load();
        return () => {
            console.log("====== kill video");
            let stream = video.srcObject;
            let tracks = stream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
            video.srcObject = null;
            video.pause();
        }
    }, [doLoad]);

    return <video
        ref={videoRef}
        width={width}
        height={height}
        autoPlay="1"
    ></video>
}
export default CameraVideo;
