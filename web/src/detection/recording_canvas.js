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
    const [pose, setPose] = useState(0);
    const [currentFrame, setCurrentFrame] = useState(recording.firstFrame);

    const frameRef = useRef(0);
    useAnimationFrame(async (timeSinceLastFrameMs, timeSinceStartMs, killRef) => {
        let frame = frameRef.current + 1;
        if (frame < recording.firstFrame) {
            frame = recording.firstFrame;
        }
        if (recording.lastFrame < frame) {
            frame = recording.firstFrame;
        }
        frameRef.current = frame;
        setCurrentFrame(frame);
        if (!killRef.current) {
            setPose(recording.poses[frame]);
        }
    }, recording && recording.poses.length > 0,
        /* fps= */ 12,
    /* dependencies=*/[recording]);
    return <div>
        <PoseCanvas
            className={classes.poseCanvas}
            pose={pose} />
        <Slider
            value={currentFrame}
            valueLabelDisplay="auto"
            min={0}
            max={recording.poses.length - 1}
        />
    </div>
}
export default RecordingCanvas;