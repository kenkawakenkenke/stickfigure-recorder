import {
    useEffect,
    useRef,
    useState,
    forwardRef,
} from "react";
import { makeStyles } from '@material-ui/core/styles';
import PoseCanvas from "../detection/pose_canvas.js";
import useAnimationFrame from "../common/animation_frame_hook.js";
import CameraVideo from "../detection/camera_reader.js";
import usePosenet from "../detection/posenet_hook.js";
import FeatureSmoother from "../detection/smoother.js";
import RecordingsView from "../components/recordings_module.js";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "250px",
    },
    canvasParent: {
        position: "relative",
        // backgroundColor: "red",
    },
    canvas: {
        // position: "absolute",
        width: "480px",
    }
}));

function useRecording(videoElement, isRecording, smoothingWindow) {
    const posenet = usePosenet();
    const [recording, setRecording] = useState([]);

    const smoothersRef = useRef({});
    useAnimationFrame(async deltaTime => {
        const net = posenet;
        const imageScaleFactor = 1;
        const outputStride = 32;
        const flipHorizontal = false;
        const pose = await net.estimateSinglePose(videoElement, imageScaleFactor, flipHorizontal, outputStride);

        pose.keypoints.forEach(feature => {
            let smoother = smoothersRef.current[feature.part];
            if (!smoother) {
                smoothersRef.current[feature.part] = smoother = new FeatureSmoother(smoothingWindow);
            }
            smoother.add(feature.position);
            const smoothed = smoother.smoothed();
            feature.position = smoothed;
        });

        setRecording(prevRecording => [...prevRecording, pose]);
    }, isRecording && posenet && videoElement);
    return recording;
}

const SMOOTHING_WINDOW = 4;
function RecorderModule({ recordingCallback }) {
    const classes = useStyles();

    const [isRecording, setIsRecording] = useState(false);

    const [videoElement, setVideoElement] = useState();
    const recording = useRecording(videoElement, setIsRecording, SMOOTHING_WINDOW);

    const startRecord = () => {
        setIsRecording(true);
    };
    const stopRecord = () => {
        setIsRecording(false);
        recordingCallback(recording);
    };

    return <div>
        <button onClick={startRecord}>Start</button>
        <button onClick={stopRecord}>Stop</button>
        <div className={classes.canvasParent}>
            <CameraVideo
                width={640}
                height={480}
                doLoad={isRecording}
                readyCallback={(video) => setVideoElement(video)}></CameraVideo>
            <PoseCanvas
                className={classes.canvas}
                pose={recording && recording[recording.length - 1]}
                width={640}
                height={480}
            ></PoseCanvas>
        </div>
        {/* Mini viewer */}
        <div>
            <RecordingsView
                recording={recording} />
        </div>
    </div>;
}
export default RecorderModule;
