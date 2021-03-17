import {
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Slider
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import PoseCanvas from "./pose_canvas";
import useAnimationFrame from "../common/animation_frame_hook.js";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "24px",
    },
    poseCanvas: {
        border: "solid 1px gray",
        maxWidth: "80%",
    }
}));

function RecordingCanvas({ recording, fixFrame }) {
    const classes = useStyles();
    const [currentFrameIndex, setCurrentFrameIndex] = useState(recording.firstFrame);
    useEffect(() => {
        if (fixFrame >= 0) {
            setCurrentFrameIndex(fixFrame);
        }
    }, [fixFrame]);

    const frameIndexRef = useRef(0);
    useAnimationFrame(async (timeSinceLastFrameMs, timeSinceStartMs, killRef) => {
        let frameIndex = frameIndexRef.current + 1;
        if (frameIndex < recording.firstFrame) {
            frameIndex = recording.firstFrame;
        }
        if (recording.lastFrame < frameIndex) {
            frameIndex = recording.firstFrame;
        }
        frameIndexRef.current = frameIndex;
        if (!killRef.current) {
            setCurrentFrameIndex(frameIndex);
        }
    },
        /* allowAnimate= */ recording && recording.frames.length > 0 && !(fixFrame >= 0),
        /* fps= */ recording.framerate || 12,
        /* dependencies=*/[recording]);
    return <div>
        <PoseCanvas
            className={classes.poseCanvas}
            frame={recording.frames[currentFrameIndex]} />
        <Slider
            value={currentFrameIndex}
            valueLabelDisplay="auto"
            min={0}
            max={recording.frames.length - 1}
        />
    </div>
}
export default RecordingCanvas;