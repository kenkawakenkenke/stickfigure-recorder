import {
    useEffect,
    useRef,
    useState,
    forwardRef,
} from "react";
import {
    Button, Paper, Typography,
    Slider
} from "@material-ui/core";
import PoseCanvas from "./pose_canvas";
import useAnimationFrame from "../common/animation_frame_hook.js";

function RecordingCanvas({ recording }) {
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
        <PoseCanvas pose={pose} />
        <Slider
            value={currentFrame}
            valueLabelDisplay="auto"
            min={recording.firstFrame}
            max={recording.lastFrame}
        />
    </div>
}
export default RecordingCanvas;