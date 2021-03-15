import {
    useEffect,
    useRef,
    useState,
    forwardRef,
} from "react";
import { makeStyles } from '@material-ui/core/styles';
import paintPose from "../detection/pose_painter.js";
import PoseCanvas from "../detection/pose_canvas.js";
import GIF from "gif.js.optimized";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "250px",
    },
    canvasParent: {
        position: "relative",
        // backgroundColor: "red",
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
            console.log("recording length:", recording.length);
            var gif = new GIF({
                workers: 2,
                quality: 10,
                workerScript: "/static/gif.worker.js",
                // width: 480,
                // height: 360,
                width: 640,
                height: 480,
            });
            const ctx = canvasRef.current.getContext('2d');
            for (const pose of recording) {
                paintPose(ctx, pose, 640, 480);

                // add an image element
                gif.addFrame(ctx, {
                    delay: 50,
                    copy: true
                });
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
        <button onClick={startRenderGif}>Render</button>
        <div
            className={classes.canvasParent}>
            <div
                className={classes.canvas}>
                <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                ></canvas>
            </div>

        </div>
    </div>;
}
export default GifRenderModule;
