import {
    useRef,
    useState,
} from "react";
import {
    Button
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import GIF from "gif.js.optimized";
import Loader from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';
import common from "stickfigurecommon";

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

async function exportToGif(recording, canvas, progressCallback) {
    progressCallback(0);

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
    canvas.width = drawWidth;
    canvas.height = drawHeight;
    const ctx = canvas.getContext('2d');
    const delay = 1000 / recording.framerate;
    for (let index = recording.firstFrame; index < recording.lastFrame; index++) {
        const frame = recording.frames[index];
        common.paintFrame(ctx, frame);
        // add an image element
        gif.addFrame(ctx, {
            delay,
            copy: true
        });
    };
    gif.on('progress', function (progress) {
        progressCallback(progress);
    });
    gif.on('finished', function (blob) {
        console.log("finished");
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.target = '_blank';
        a.download = 'stickfigure.gif';
        a.click();
        progressCallback(undefined);
    });
    gif.render();
}

function ExportModule({ recording }) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [progress, setProgress] = useState();
    const isProcessing = progress >= 0;
    const canvasRef = useRef();

    function doExportToGif() {
        exportToGif(recording, canvasRef.current, setProgress);
    }
    return <div>
        <div
            className={classes.canvasParent}>
            {!isProcessing &&
                <Button onClick={doExportToGif} variant="contained" color="primary">
                    {t("Do export gif")}
                </Button>
            }
            {isProcessing && <div>
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
export default ExportModule;
