import { useState } from "react";
import {
    Typography, Slider
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import RecordingCanvas from "../detection/recording_canvas.js";
import { setFrameStartEnd } from "../detection/recording_editor.js";
import { useTranslation } from 'react-i18next';
import StartEndSlider from "./start_end_slider.js";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "14px",
    },
    poseCanvas: {
        border: "solid 1px gray",
        maxWidth: "80%",
    }
}));

function EditModule({ recording, editCallback }) {
    const classes = useStyles();
    const { t } = useTranslation();

    // The frame index to force on <RecordingCanvas>
    // This is useful because it lets the user preview the frame as they update the
    // start/end frames. 
    const [fixFrame, setFixFrame] = useState();
    return <div className={classes.root}>
        <RecordingCanvas
            recording={recording}
            fixFrame={fixFrame}
        />

        <Typography variant="body1">{t("Set the start and end range to export")}</Typography>
        <StartEndSlider
            range={[recording.firstFrame, recording.lastFrame]}
            maxIndex={recording.frames.length - 1}
            setRange={
                ([start, end]) => {
                    if (recording.firstFrame !== start) {
                        setFixFrame(start);
                    } else if (recording.lastFrame !== end) {
                        setFixFrame(end);
                    }
                    const newRecording = JSON.parse(JSON.stringify(recording));
                    setFrameStartEnd(newRecording, start, end);
                    editCallback(newRecording);
                }
            }
            beginFocusCallback={frameIndex => setFixFrame(frameIndex)}
            stopFocusCallback={() => {
                setFixFrame(undefined);
            }}
        />
    </div >;
}
export default EditModule;
