import {
    useRef,
    useState,
} from "react";
import {
    Button, Typography
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import GIF from "gif.js.optimized";
import Loader from 'react-loader-spinner';
import { Trans, useTranslation } from 'react-i18next';
import common from "stickfigurecommon";
import firebase from "../framework/setup_firebase.js";

const useStyles = makeStyles((theme) => ({
    root: {
    },
    canvas: {
        display: "none",
    },
    exportContainer: {
        border: "1px solid #bbbbbb",
        padding: "12px",
        borderRadius: "8px",
        marginTop: "8px",
    },

    loaderProgress: {
        display: "flex",
        alignItems: "center",
    },
    loader: {
        margin: "4px",
    }
}));

function upload(recording, finishedCallback, addToGallery) {
    firebase.app().functions("asia-northeast1")
        .httpsCallable('uploadGifRecording')({
            recording: recording,
            addToGallery,
        }).then(result => {
            console.log(result.data);
            finishedCallback(result.data);
        })
        .catch(err => alert("Error!", err));
}

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

function ProgressViewer({ progress, title }) {
    const classes = useStyles();
    const isProcessing = progress >= 0;
    if (!isProcessing) {
        return <div></div>;
    }
    return <div>
        {title}
        <div className={classes.loaderProgress}>
            <Loader className={classes.loader} type="Oval" color="#888888" height={48} width={48} />
            {progress > 0 && `${Math.floor(progress * 100)}%`}
        </div>
    </div>;
}
function GifFileExporter({ recording, canvas }) {
    const { t } = useTranslation();

    const [progress, setProgress] = useState();
    const isProcessing = progress >= 0;

    function doExport() {
        exportToGif(recording, canvas, setProgress);
    }
    return <div>
        <Typography variant="h5">{t("Do export gif")}</Typography>
        <Button onClick={doExport} disabled={isProcessing} variant="contained" color="primary">
            {t("Do export gif button")}
        </Button>
        <ProgressViewer progress={progress} title={t("Rendering GIF")} />
    </div>;
}

function GifGalleryUploader({ recording }) {
    const { t } = useTranslation();

    const [isProcessing, setProcessing] = useState(false);
    const [uploadedGifInfo, setUploadedGifInfo] = useState();

    function doUpload() {
        setProcessing(true);
        upload(recording, (uploadResponse) => {
            setProcessing(false);
            setUploadedGifInfo(uploadResponse);
        },
        /* addToGallery= */ true);
    }
    return <div>
        <Typography variant="h5">{t("Upload to gallery")}</Typography>
        <Typography variant="body2">
            <Trans i18nKey="Upload to gallery disclaimer">
                Your gif will be uploaded and <a href="/gallery" target="_blank">shared publicly.</a>
            </Trans>
        </Typography>
        <Button disabled={isProcessing} onClick={doUpload} variant="contained" color="primary">
            {t("Upload to gallery button")}
        </Button>
        <ProgressViewer progress={isProcessing ? 0 : undefined} title={t("Uploading GIF")} />
        {uploadedGifInfo && <div>
            <Trans i18nKey="Upload success">
                Upload success, <a href={`/gallery/${uploadedGifInfo.gifID}`} target="_blank">click here</a>.
            </Trans>
        </div>}
    </div>;
}

function ExportModule({ recording }) {
    const classes = useStyles();
    const { t } = useTranslation();

    const canvasRef = useRef();

    return <div>
        <div className={classes.exportContainer}>
            <GifFileExporter
                recording={recording}
                canvas={canvasRef.current}
            />
        </div>

        <div className={classes.exportContainer}>
            <GifGalleryUploader
                recording={recording} />
        </div>

        {/* Invisible canvas for rendering. */}
        <div
            className={classes.canvas}>
            <canvas ref={canvasRef}></canvas>
        </div>
    </div>;
}
export default ExportModule;
