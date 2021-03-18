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
        display: "none",
    }
}));

function GifRenderModule({ recording }) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [rendering, setRendering] = useState(false);
    const [progress, setProgress] = useState();
    const canvasRef = useRef();

    const startRenderGif = () => {
        setRendering(true);
        const render = async () => {
            if (!recording.frames.length) {
                throw new Error("nothing to export");
            }
            const drawWidth = recording.exportWidth;
            const drawHeight = recording.exportHeight;
            var gif = new GIF({
                workers: 2,
                quality: 10,
                workerScript: "/static/gif.worker.js",
                width: drawWidth,
                height: drawHeight,
            });
            canvasRef.current.width = drawWidth;
            canvasRef.current.height = drawHeight;
            const ctx = canvasRef.current.getContext('2d');
            const delay = 1000 / recording.framerate;
            for (let index = recording.firstFrame; index < recording.lastFrame; index++) {
                const frame = recording.frames[index];
                paintFrame(ctx, frame);
                // add an image element
                gif.addFrame(ctx, {
                    delay,
                    copy: true
                });
            };
            gif.on('progress', function (progress) {
                setProgress(progress);
            });
            gif.on('finished', function (blob) {
                setRendering(false);
                console.log("finished");
                var a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.target = '_blank';
                a.download = 'stickfigure.gif';
                a.click();
                setProgress(undefined);
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
            {progress && `${Math.floor(progress * 100)}%`}

            {/* Invisible canvas for rendering. */}
            <div
                className={classes.canvas}>
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>

    </div>;
}
export default GifRenderModule;
