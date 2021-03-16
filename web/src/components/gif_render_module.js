import {
    useRef,
    useState,
} from "react";
import {
    Button
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import paintPose from "../detection/pose_painter.js";
import GIF from "gif.js.optimized";
import Loader from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';

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

function GifRenderModule({ recording }) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [rendering, setRendering] = useState(false);
    const canvasRef = useRef();

    const startRenderGif = () => {
        setRendering(true);
        const render = async () => {
            if (!recording.poses.length) {
                throw "nothing to export";
            }
            console.log("recording length:", recording.poses.length);
            const width = recording.poses[0].videoWidth;
            const height = recording.poses[0].videoHeight;
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
            let prevT = recording.poses[recording.firstFrame].t;
            for (let index = recording.firstFrame; index < recording.lastFrame; index++) {
                const pose = recording.poses[index];
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
                setRendering(false);
                console.log("finished");
                // window.open(URL.createObjectURL(blob));
                var a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.target = '_blank';
                a.download = 'stickfigure.gif';
                a.click();
            });
            gif.render();
        };
        render();
    };

    return <div>
        <div
            className={classes.canvasParent}>
            {!rendering &&
                <Button onClick={startRenderGif} variant="contained" color="primary">
                    {t("Do export gif")}
                </Button>
            }
            {rendering && <div>
                {t("Rendering GIF")}
                <Loader type="Oval" color="#888888" height={48} width={48}></Loader>
            </div>}
            <div
                className={classes.canvas}>
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>

    </div>;
}
export default GifRenderModule;
