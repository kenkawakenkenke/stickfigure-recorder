import {
    useCallback,
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
                resolve(video);
            };
        });
    } else {
        const errorMessage = "This browser does not support video capture, or this device does not have a camera";
        alert(errorMessage);
        return Promise.reject(errorMessage);
    }
}

function CameraVideo({ readyCallback, className }) {
    const videoRef = useRef();

    const readyCallbackRef = useCallback(readyCallback, [readyCallback]);
    useEffect(() => {
        const video = videoRef.current;
        async function load() {
            await setupCamera(video);
            video.play();

            readyCallbackRef(video);
        }
        load();
        return () => {
            let stream = video.srcObject;
            let tracks = stream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
            video.srcObject = null;
            video.pause();
        }
    }, [readyCallbackRef]);

    return <video
        className={className}
        ref={videoRef}
        autoPlay="1"
    ></video>
}
export default CameraVideo;
