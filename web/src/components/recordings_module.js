import {
    useEffect,
    useRef,
    useState,
    forwardRef,
    cloneElement,
} from "react";
import { makeStyles } from '@material-ui/core/styles';
import PoseCanvas from "../detection/pose_canvas.js";

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
        width: "200px",
        border: "solid 1px gray",
    },
}));

function formatTime(tMs) {
    const sec = Math.floor(tMs / 1000);
    const ms = Math.floor(tMs % 1000).toString().padStart(3, "0");
    return `${sec}.${ms}`
}

function RecordingsView({ recording, outEvery, children }) {
    const classes = useStyles();

    const sparseRecordings = [];
    for (let i = 0; i < recording.length; i += outEvery) {
        sparseRecordings.push(recording[i]);
    }
    return <div className={classes.poseParent}>
        {sparseRecordings.map((pose, idx) =>
            <div
                key={`minipose_${idx}`}
                className={classes.poseDiv}
            >
                <PoseCanvas
                    className={classes.poseCanvas}
                    pose={pose}
                    width={pose.videoWidth || 100}
                    height={pose.videoHeight || 100}
                />
                <div>
                    {formatTime(pose.t)}
                </div>
                {
                    children && cloneElement(children,
                        {
                            pose,
                            poseIndex: idx,
                            recording,
                            // recordingCallback: (newRecording) => setRecording
                        })
                }
                {/* {children && children.length > 0 &&
                    cloneElement(children[0],
                        // Props to pass to children
                        {
                            pose: pose
                        })} */}
            </div>
        )}
    </div>;
}
export default RecordingsView;