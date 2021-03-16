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

function GifRenderModule({ recording }) {
    const classes = useStyles();

    const canvasRef = useRef();

    const startRenderGif = () => {
        const render = async () => {
            if (!recording.length) {
                throw "nothing to export";
            }
            console.log("recording length:", recording.length);
            const width = recording[0].videoWidth;
            const height = recording[0].videoHeight;
            console.log(width, height);
            var gif = new GIF({
                workers: 2,
                quality: 10,
                workerScript: "/static/gif.worker.js",
                width,
                height,
            });
            canvasRef.current.width = width;
            canvasRef.current.height = height;
            const ctx = canvasRef.current.getContext('2d');
            let prevT = recording[0].t;
            for (const pose of recording) {
                paintPose(ctx, pose);
                // add an image element
                const delay = pose.t - prevT;
                // console.log(pose.t, delay);
                gif.addFrame(ctx, {
                    delay,
                    copy: true
                });
                prevT = pose.t;
            };

            gif.on('finished', function (blob) {
                console.log("finished");
                window.open(URL.createObjectURL(blob));
            });

            console.log("render");
            gif.render();
        };
        render();
    };

    return <div>
        <div
            className={classes.canvasParent}>
            <Button onClick={startRenderGif} variant="contained" color="primary">Render</Button>
            <div
                className={classes.canvas}>
                <canvas
                    ref={canvasRef}
                ></canvas>
            </div>
        </div>

    </div>;
}
export default GifRenderModule;
