import {
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
        // margin: "8px",
        // width: "100%",
        // height: "250px",
    },
    poseCanvas: {
        border: "solid 1px gray",
        maxWidth: "80%",
    }
}));

function RecordingCanvas({ recording }) {
    const classes = useStyles();
    const [frame, setFrame] = useState(0);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(recording.firstFrame);

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
        setCurrentFrameIndex(frameIndex);
        if (!killRef.current) {
            setFrame(recording.frames[frameIndex]);
        }
    }, recording && recording.frames.length > 0,
        /* fps= */ 12,
        /* dependencies=*/[recording]);
    return <div>
        <PoseCanvas
            className={classes.poseCanvas}
            frame={frame} />
        <Slider
            value={currentFrameIndex}
            valueLabelDisplay="auto"
            min={0}
            max={recording.frames.length - 1}
        />
    </div>
}
export default RecordingCanvas;