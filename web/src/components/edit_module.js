import {
    Typography, Slider
} from "@material-ui/core";
import RecordingCanvas from "../detection/recording_canvas.js";
import { setFrameStartEnd } from "../detection/recording_editor.js";

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

    // const [showEveryFrame, setShowEveryFrame] = useState(4);
    return <div>
        <Typography variant="body1">This is what your gif will look like:</Typography>
        <RecordingCanvas recording={recording} />

        Set the start and end range to export:
        <Slider
            value={[recording.firstFrame, recording.lastFrame]}
            onChange={(e, newRange) => {
                const newRecording = JSON.parse(JSON.stringify(recording));
                setFrameStartEnd(newRecording, newRange[0], newRange[1]);
                editCallback(newRecording);
            }}
            valueLabelDisplay="auto"
            min={0}
            max={recording.poses.length - 1}
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
