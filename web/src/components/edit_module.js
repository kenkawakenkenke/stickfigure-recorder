import {
    useEffect,
    useRef,
    useState,
    forwardRef,
} from "react";
import {
    Button, Paper, Typography
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import paintPose from "../detection/pose_painter.js";
import RecordingsView from "./recordings_module.js";
import GIF from "gif.js.optimized";

const useStyles = makeStyles((theme) => ({
    root: {
        // width: "100%",
        // height: "250px",
    },
    canvasParent: {
        position: "relative",
        // backgroundColor: "red",
    },
    poses: {

    },
    canvas: {
        // position: "absolute",
    }
}));

async function sleep(wait) {
    return new Promise(resolve => {
        setTimeout(() => resolve(0), wait);
    });
}

function PoseEditor({ pose, poseIndex, recording }) {
    function setFirstFrame() {
        recording.forEach((pose, idx) => {
            if (idx < poseIndex) {
                pose.dropped = true;
            } else {
                pose.dropped = false;
            }
        })
    }
    return <div>
        <Button onClick={setFirstFrame}>First frame</Button>
        <Button>Last frame</Button>
    </div>
    return "Edit!: " + pose?.t;
}

function EditModule({ recording, editCallback }) {
    const classes = useStyles();

    const canvasRef = useRef();

    // function doSave() {
    //     editCallback(recording);
    // }
    return <div>
        {/* Mini viewer */}
        <div className={classes.poses}>
            <RecordingsView
                recording={recording}
                outEvery={1}>
                <PoseEditor />
            </RecordingsView>
        </div>
        {/* <Button onClick={doSave} variant="contained" color="primary">OK</Button> */}

    </div>;
}
export default EditModule;
