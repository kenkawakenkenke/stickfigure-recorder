import { useState } from "react";
import {
    Typography, Slider, TextField,
    FormControlLabel,
    FormControl, FormLabel, Radio, RadioGroup,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import RecordingCanvas from "../detection/recording_canvas.js";
import { setFrameStartEnd } from "../detection/recording_editor.js";
import { useTranslation } from 'react-i18next';
import StartEndSlider from "./start_end_slider.js";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "14px",
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
    poseCanvas: {
        border: "solid 1px gray",
        maxWidth: "80%",
    },
    framerateSlider: {
        maxWidth: "50%"
    },
    formControl: {
        marginTop: "8px",
        borderTop: "solid #dddddd 1px",
    },
}));

function ExportSizeControl({ recording, editCallback }) {
    const { t } = useTranslation();
    const [aspectRatioConstraint, setAspectRatioConstraint] = useState("video");
    function constrainHeight(width, constraint = aspectRatioConstraint) {
        switch (constraint) {
            case "video":
                return Math.floor(width * recording.frames[0].videoHeight / recording.frames[0].videoWidth);
            case "1:1":
                return width;
            case "none":
            default:
                return recording.exportHeight;
        }
    }
    function constrainWidth(height, constraint = aspectRatioConstraint) {
        switch (constraint) {
            case "video":
                return Math.floor(height * recording.frames[0].videoWidth / recording.frames[0].videoHeight);
            case "1:1":
                return height;
            case "none":
            default:
                return recording.exportWidth;
        }
    }
    return <div>
        <Typography id="export-size" gutterBottom>
            {t("Export size")}
        </Typography>
        <TextField
            label={t("Width")}
            type="number"
            value={recording.exportWidth || recording.frames[0].videoWidth}
            onChange={(e) => {
                const newRecording = JSON.parse(JSON.stringify(recording));
                const newWidth = e.target.value;
                newRecording.exportWidth = newWidth;
                newRecording.exportHeight = constrainHeight(newWidth);
                editCallback(newRecording);
            }}
        />
        <TextField
            label={t("Height")}
            type="number"
            value={recording.exportHeight || recording.frames[0].videoHeight}
            onChange={(e) => {
                const newRecording = JSON.parse(JSON.stringify(recording));
                const newHeight = e.target.value;
                newRecording.exportHeight = newHeight;
                newRecording.exportWidth = constrainWidth(newHeight);
                editCallback(newRecording);
            }} />

        <FormControl component="fieldset">
            <FormLabel component="legend">Constrain aspect ratio:</FormLabel>
            <RadioGroup aria-label="aspect constraint" name="aspectConstraint"
                value={aspectRatioConstraint}
                onChange={e => {
                    const constraint = e.target.value;
                    const newRecording = JSON.parse(JSON.stringify(recording));
                    newRecording.exportHeight = constrainHeight(recording.exportWidth, constraint);
                    editCallback(newRecording);
                    setAspectRatioConstraint(constraint);
                }}>
                <FormControlLabel value="video" control={<Radio />} label={t("Same as video")} />
                <FormControlLabel value="1:1" control={<Radio />} label={t("1_1")} />
                <FormControlLabel value="none" control={<Radio />} label={t("No aspect ratio constraint")} />
            </RadioGroup>
        </FormControl>

    </div >;
}
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

        <div className={classes.formControl}>
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
        </div>

        <div className={classes.formControl}>
            <Typography id="slider-framerate" gutterBottom>
                {t("Playback speed")}: {recording.framerate}
            </Typography>
            <Slider
                className={classes.framerateSlider}
                value={recording.framerate}
                onChange={(e, newValue) => {
                    const newRecording = JSON.parse(JSON.stringify(recording));
                    newRecording.framerate = newValue;
                    editCallback(newRecording);
                }}
                aria-labelledby="slider-framerate"
                min={1}
                max={60}
                step={1}
                valueLabelDisplay="auto"
            />
        </div>

        <div className={classes.formControl}>
            <ExportSizeControl
                recording={recording}
                editCallback={editCallback} />
        </div>
    </div >;
}
export default EditModule;
