import {
    Typography, Slider
} from "@material-ui/core";
import RecordingCanvas from "../detection/recording_canvas.js";
import { setFrameStartEnd } from "../detection/recording_editor.js";
import { useTranslation } from 'react-i18next';

// const useStyles = makeStyles((theme) => ({
//     root: {
//         // width: "100%",
//         // height: "250px",
//     },
//     canvasParent: {
//         position: "relative",
//         // backgroundColor: "red",
//     },
//     poses: {

//     },
//     canvas: {
//         // position: "absolute",
//     }
// }));

function EditModule({ recording, editCallback }) {
    // const classes = useStyles();
    const { t } = useTranslation();

    // const [showEveryFrame, setShowEveryFrame] = useState(4);
    return <div>
        <RecordingCanvas recording={recording} />

        <Typography variant="body1">{t("Set the start and end range to export")}</Typography>
        <Slider
            value={[recording.firstFrame, recording.lastFrame]}
            onChange={(e, newRange) => {
                const newRecording = JSON.parse(JSON.stringify(recording));
                setFrameStartEnd(newRecording, newRange[0], newRange[1]);
                editCallback(newRecording);
            }}
            valueLabelDisplay="auto"
            min={0}
            max={recording.frames.length - 1}
        />

        {/* <Typography id="frame-zoom-slider" gutterBottom>
            Frame zoom level
        </Typography>
        <Slider
            onChange={(e, newValue) => { setShowEveryFrame(newValue) }}
            value={showEveryFrame}
            getAriaValueText={v => v}
            aria-labelledby="frame-zoom-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={recording.poses.length}
        /> */}

        {/* Mini viewer */}
        {/* <div className={classes.poses}>
            Set the first and last frames to export (or leave as is, if you like).
            <RecordingsView
                recording={recording}
                outEvery={showEveryFrame}
                updateRecordingCallback={(newRecordings) => {
                    editCallback(newRecordings);
                }}
            >
            </RecordingsView>
        </div> */}

    </div >;
}
export default EditModule;
