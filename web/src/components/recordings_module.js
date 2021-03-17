import {
    Button
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import PoseCanvas from "../detection/pose_canvas.js";
import { setFrameStartEnd } from "../detection/recording_editor.js";

const useStyles = makeStyles((theme) => ({
    poseParent: {
        display: "flex",
        flexFlow: "row wrap",
    },
    poseDiv: {
        // width: "200px",
        display: "flex",
        flexFlow: "column",
        margin: "2px",
    },
    poseCanvas: {
        width: "180px",
        border: "solid 1px gray",
    },
}));

function formatTime(tMs) {
    const sec = Math.floor(tMs / 1000);
    const ms = Math.floor(tMs % 1000).toString().padStart(3, "0");
    return `${sec}.${ms}`
}

function RecordingsView({ recording, outEvery, children, updateRecordingCallback }) {
    const classes = useStyles();

    const sparseRecordings = [];
    for (let i = 0; i < recording.frames.length; i += outEvery) {
        sparseRecordings.push(recording.frames[i]);
    }
    function setFirstFrame(frame) {
        const newRecording = JSON.parse(JSON.stringify(recording));
        setFrameStartEnd(newRecording, frame.frameIndex, newRecording.lastFrame);
        updateRecordingCallback(newRecording);
    }
    function setLastFrame(frame) {
        const newRecording = JSON.parse(JSON.stringify(recording));
        setFrameStartEnd(newRecording, newRecording.lastFrame, frame.frameIndex);
        updateRecordingCallback(newRecording);
    }
    return <div className={classes.poseParent}>
        {sparseRecordings.map(frame =>
            <div
                key={`miniframe_${frame.frameIndex}`}
                className={classes.frameDiv}
            >
                <PoseCanvas
                    className={classes.poseCanvas}
                    frame={frame}
                />
                <div>
                    <b>{frame.frameIndex}</b> <small>{formatTime(frame.t)}</small>
                </div>
                <div>
                    <Button
                        disabled={frame.frameIndex >= recording.lastFrame}
                        onClick={() => setFirstFrame(frame)}
                        size="small">First frame</Button>
                    <Button
                        disabled={frame.frameIndex <= recording.firstFrame}
                        onClick={() => setLastFrame(frame)}
                        size="small"
                    >Last frame</Button>
                </div>
            </div>
        )
        }
    </div >;
}
export default RecordingsView;