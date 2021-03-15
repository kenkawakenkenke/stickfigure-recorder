import {
    useEffect,
    useRef,
    useState,
    forwardRef,
} from "react";
import { makeStyles } from '@material-ui/core/styles';
import PoseCanvas from "../detection/pose_canvas.js";

const useStyles = makeStyles((theme) => ({
    miniPoseCanvas: {
        width: "200px",
    },
}));

function RecordingsView({ recording }) {
    const classes = useStyles();

    const sparseRecordings = [];
    for (let i = 0; i < recording.length; i += 10) {
        sparseRecordings.push(recording[i]);
    }
    return <div>
        {sparseRecordings.map((pose, idx) => <PoseCanvas
            className={classes.miniPoseCanvas}
            key={`minipose_${idx}`}
            pose={pose}
            width={640}
            height={480}
        />)}
    </div>;
}
export default RecordingsView;