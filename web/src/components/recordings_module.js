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
    for (let i = 0; i < recording.poses.length; i += outEvery) {
        sparseRecordings.push(recording.poses[i]);
    }
    function setFirstFrame(pose) {
        const newRecording = JSON.parse(JSON.stringify(recording));
        setFrameStartEnd(newRecording, pose.frameIndex, newRecording.lastFrame);
        updateRecordingCallback(newRecording);
    }
    function setLastFrame(pose) {
        const newRecording = JSON.parse(JSON.stringify(recording));
        setFrameStartEnd(newRecording, newRecording.lastFrame, pose.frameIndex);
        updateRecordingCallback(newRecording);
    }
    return <div className={classes.poseParent}>
        {sparseRecordings.map(pose =>
            <div
                key={`minipose_${pose.frameIndex}`}
                className={classes.poseDiv}
            >
                <PoseCanvas
                    className={classes.poseCanvas}
                    pose={pose}
                    width={pose.videoWidth || 100}
                    height={pose.videoHeight || 100}
                />
                <div>
                    <b>{pose.frameIndex}</b> <small>{formatTime(pose.t)}</small>
                </div>
                <div>
                    <Button
                        disabled={pose.frameIndex >= recording.lastFrame}
                        onClick={() => setFirstFrame(pose)}
                        size="small">First frame</Button>
                    <Button
                        disabled={pose.frameIndex <= recording.firstFrame}
                        onClick={() => setLastFrame(pose)}
                        size="small"
                    >Last frame</Button>
                </div>
            </div>
        )
        }
    </div >;
}
export default RecordingsView;