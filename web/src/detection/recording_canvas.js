import {
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Button,
    Slider
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import PoseCanvas from "./pose_canvas";
import useAnimationFrame from "../common/animation_frame_hook.js";
import { useTranslation } from "react-i18next";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "24px",
    },
    poseCanvas: {
        border: "solid 1px gray",
        maxWidth: "80%",
        maxHeight: "80%",
    }
}));

function RecordingCanvas({ recording, fixFrame, frameIndexCallback }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const [currentFrameIndex, setCurrentFrameIndex] = useState(recording.firstFrame);
    const [isPlaying, setIsPlaying] = useState(true);

    const [scrollPosition, setScrollPosition] = useState();
    const mergedFixFrame = fixFrame >= 0 ? fixFrame : scrollPosition;

    useEffect(() => {
        if (mergedFixFrame >= 0) {
            // setCurrentFrameIndex(mergedFixFrame);
            // frameIndexRef.current = mergedFixFrame;
            setFrameIndex(mergedFixFrame);
        }
    }, [mergedFixFrame]);

    const frameIndexRef = useRef(0);
    function setFrameIndex(frameIndex) {
        frameIndexRef.current = frameIndex;
        setCurrentFrameIndex(frameIndex);
        frameIndexCallback(frameIndex);
    }
    useAnimationFrame(async (timeSinceLastFrameMs, timeSinceStartMs, isDead) => {
        let frameIndex = frameIndexRef.current + 1;
        if (frameIndex < recording.firstFrame) {
            frameIndex = recording.firstFrame;
        }
        if (recording.lastFrame < frameIndex) {
            frameIndex = recording.firstFrame;
        }
        // frameIndexRef.current = frameIndex;
        if (!isDead()) {
            setFrameIndex(frameIndex);
            // setCurrentFrameIndex(frameIndex);
        }
    },
        /* allowAnimate= */ recording && recording.frames.length > 0 && !(mergedFixFrame >= 0) && isPlaying,
        /* fps= */ recording.framerate || 12,
        /* dependencies=*/[recording]);
    return <div>
        <PoseCanvas
            className={classes.poseCanvas}
            frame={recording.frames[currentFrameIndex]}
            drawWidth={recording.exportWidth}
            drawHeight={recording.exportHeight}
        />
        <Slider
            value={currentFrameIndex}
            valueLabelDisplay="auto"
            min={0}
            max={recording.frames.length - 1}
            onChange={(e, newValue) => setScrollPosition(newValue)}
            onChangeCommitted={(e, newValue) => setScrollPosition(undefined)}
        />
        {isPlaying ?
            <Button onClick={() => setIsPlaying(false)}
                variant="contained"
                startIcon={<PauseIcon />}>{t("Pause")}
            </Button>
            : <Button onClick={() => setIsPlaying(true)}
                variant="contained"
                startIcon={<PlayArrowIcon />}>{t("Play")}
            </Button>}
    </div >
}
export default RecordingCanvas;