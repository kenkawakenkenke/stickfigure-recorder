import {
    useRef,
    useState,
} from "react";
import {
    Button
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import paintFrame from "../detection/pose_painter.js";
import GIF from "gif.js.optimized";
import Loader from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
    },
    canvasParent: {
        position: "relative",
    },
    canvas: {
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
            if (!recording.frames.length) {
                throw "nothing to export";
            }
            console.log("recording length:", recording.frames.length);
            const width = recording.frames[0].videoWidth;
            const height = recording.frames[0].videoHeight;
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
            let prevT = recording.frames[recording.firstFrame].t;
            for (let index = recording.firstFrame; index < recording.lastFrame; index++) {
                const frame = recording.frames[index];
                paintFrame(ctx, frame);
                // add an image element
                const delay = frame.t - prevT;
                gif.addFrame(ctx, {
                    delay,
                    copy: true
                });
                prevT = frame.t;
            };

            gif.on('finished', function (blob) {
                setRendering(false);
                console.log("finished");
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
