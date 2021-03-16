import {
    useEffect,
    useRef,
    useState,
    forwardRef,
} from "react";
import {
    Button, Paper, Typography
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import PoseCanvas from "../detection/pose_canvas.js";
import useAnimationFrame from "../common/animation_frame_hook.js";
import CameraVideo from "../detection/camera_reader.js";
import usePosenet from "../detection/posenet_hook.js";
import FeatureSmoother from "../detection/smoother.js";
import RecordingsView from "../components/recordings_module.js";
import Loader from 'react-loader-spinner';
import { normalizeTime } from "../detection/recording_editor.js";

const useStyles = makeStyles((theme) => ({
    root: {
        // backgroundColor: "#bbbbff",
        // width: "100%",
    },
    canvasContainer: {
        marginTop: "8px",
        marginBottom: "8px",
        padding: "8px",
        display: "inline-block",
    },
    canvas: {
        position: "absolute",
        top: "0",
        left: "0",
        // width: "480px",
    },
    canvasParent: {
        position: "relative",
        display: "inline-block",
    },
    videoCanvas: {
    },
    poses: {
        // backgroundColor: "red",
        // width: "400px",
    }
}));

function useRecording(videoElement, isRecording, smoothingWindow) {
    const [recording, setRecording] = useState([]);
    const posenet = usePosenet();

    // Return a "waiting" message if we're told to record but we're not ready.
    const loadingMessage = isRecording && (!posenet || !videoElement) ?
        ("Waiting for: " +
            [!posenet && "PoseNet",
            !videoElement && "video"]
                .filter(x => x)
                .join(", "))
        : undefined;

    const smoothersRef = useRef({});
    useAnimationFrame(async (timeSinceLastFrameMs, timeSinceStartMs, killRef) => {
        // console.log(timeSinceLastFrameMs, timeSinceStartMs);
        const net = posenet;
        const imageScaleFactor = 1;
        const outputStride = 32;
        const flipHorizontal = false;
        videoElement.width = videoElement.videoWidth;
        videoElement.height = videoElement.videoHeight;
        const pose = await net.estimateSinglePose(videoElement, imageScaleFactor, flipHorizontal, outputStride);
        pose.videoWidth = videoElement.videoWidth;
        pose.videoHeight = videoElement.videoHeight;
        pose.t = timeSinceStartMs;

        // Smoothing
        pose.keypoints.forEach(feature => {
            let smoother = smoothersRef.current[feature.part];
            if (!smoother) {
                smoothersRef.current[feature.part] = smoother = new FeatureSmoother(smoothingWindow);
            }
            smoother.add(feature.position);
            const smoothed = smoother.smoothed();
            feature.position = smoothed;
        });
        if (killRef.current) {
            return;
        }
        if (timeSinceStartMs === 0) {
            // skip: the first frame is always weird (has a huge lag)
            return;
        }
        setRecording(prevRecording => [...prevRecording, pose]);
    }, isRecording && posenet && videoElement,
        /* fps= */ 12);
    return [recording, loadingMessage];
}

const SMOOTHING_WINDOW = 4;
function RecorderModule({ recordingCallback }) {
    const classes = useStyles();

    const [isRecording, setIsRecording] = useState(false);

    const [videoElement, setVideoElement] = useState();
    const [recording, loadingMessage] = useRecording(videoElement, isRecording, SMOOTHING_WINDOW);

    const startRecord = () => {
        setIsRecording(true);
    };
    const stopRecord = () => {
        setIsRecording(false);

        // Final tweaks before saving.

        // Ensure time always starts at 0.
        let tweakedRecording = [
            ...recording
        ];
        normalizeTime(tweakedRecording);

        // Notify parent.
        recordingCallback(tweakedRecording);
    };

    return <div className={classes.root}>

        <div>
            {!isRecording && <Button onClick={startRecord} variant="contained" color="primary">Record</Button>}
            {isRecording && recording.length > 0 && <Button onClick={stopRecord} variant="contained" color="primary">Stop</Button>}
        </div>

        <div className={classes.canvasContainer} elevation={4}>
            <div className={classes.canvasParent}>
                {loadingMessage && <div>
                    {loadingMessage}
                    <Loader type="Oval" color="#888888" height={48} width={48}></Loader>
                </div>}

                <CameraVideo
                    className={classes.videoCanvas}
                    doLoad={isRecording}
                    readyCallback={(video) => setVideoElement(video)} />
                <PoseCanvas
                    className={classes.canvas}
                    pose={recording && recording[recording.length - 1]}
                    backgroundOpacity={0.5} />
            </div>
        </div>

        {/* Mini viewer */}
        <div className={classes.poses}>
            <RecordingsView
                recording={recording}
                outEvery={12} />
        </div>
    </div >;
}
export default RecorderModule;
