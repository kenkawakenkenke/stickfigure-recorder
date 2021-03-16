import {
    useEffect,
    useState,
} from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
    Button, Link, Paper, Typography
} from "@material-ui/core";

import RecorderModule from "../components/recorder_module.js";
import EditModule from "../components/edit_module.js";
import GifRenderModule from "../components/gif_render_module.js";
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "24px",
        // margin: "8px",
        // width: "100%",
        // height: "250px",
    },
    descriptionCard: {
        // margin: "24px",
    },
    moduleCard: {
        marginTop: "24px",
        // margin: "24px",
        // marginLeft: "24px",
        // marginRight: "24px",
        padding: "8px",
    },
    smallGif: {
        width: "80px",
    },
    largeGif: {
        maxWidth: "100%",
    }
}));

// From: https://qiita.com/qrusadorz/items/14972b6e069feaf777a9
function AdsCard(props) {
    useEffect(() => {
        if (window.adsbygoogle/* && process.env.NODE_ENV !== "development"*/) {
            window.adsbygoogle.push({});
        }
    }, [])

    return (
        <ins className="adsbygoogle"
            style={{ "display": "block" }}
            data-ad-client={process.env.REACT_APP_GOOGLE_AD_CLIENT}
            data-ad-slot={process.env.REACT_APP_GOOGLE_AD_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
    );
}

function PageDescription() {
    const classes = useStyles();

    return <div className={classes.descriptionCard}>
        <Typography variant="h3">
            <Trans>Stickfigure Recorder</Trans>
        </Typography>
        <div>
            <img src="/imgs/small_dance.gif" alt="dancing gif" className={classes.smallGif} />
            <img src="/imgs/small_exercise.gif" alt="working out gif" className={classes.smallGif} />
            <img src="/imgs/small_fighting.gif" alt="fighting gif" className={classes.smallGif} />
            <img src="/imgs/small_running.gif" alt="running gif" className={classes.smallGif} />
        </div>
        <Trans>Create animated stickfigure gifs!</Trans>
        <div>
            <img src="/imgs/stickfigure_recording.gif" alt="stickfigure recording gif" className={classes.largeGif} />
        </div>
        <div>
            <p>
                <Trans i18nKey="detailedDescription1">
                    We use <a href="https://www.tensorflow.org/lite/examples/pose_estimation/overview" target="_blank" rel="noreferrer">PoseNet</a> to estimate your pose and generate stickfigures.
                </Trans>
            </p>
            <p>
                <Trans i18nKey="detailedDescription2">
                    I built this to generate gifs for <a href="https://open-ken.web.app/" target="_blank" rel="noreferrer">another website</a>
                </Trans>
            </p>
            <p>
                <Trans i18nKey="openSourcedHere">
                    The entire website is open sourced here:
                </Trans>
            </p>
            <a href="https://github.com/kenkawakenkenke/stickfigure-recorder" target="_blank" rel="noreferrer"><img src="https://gh-card.dev/repos/kenkawakenkenke/stickfigure-recorder.svg" alt="stickfigure recorder github info" /></a>
        </div>
    </div >
}

function MainPage() {
    const classes = useStyles();
    const { t, i18n } = useTranslation();

    const [recording, setRecording] = useState();

    const doReset = () => {
        setRecording(undefined);
    }
    return <div className={classes.root}>
        <div>
            <PageDescription />
        </div>

        {/* Record */}
        <Paper elevation={4} className={classes.moduleCard}>
            <Typography variant="h4">1. <Trans i18nKey="TitleRecord">Record!</Trans></Typography>
            {!recording && <RecorderModule recordingCallback={newRecording => setRecording(newRecording)} />}
            {recording &&
                <Button onClick={doReset} variant="contained" color="secondary">
                    {t("Start again")}
                </Button>}
        </Paper>

        {/* Edit */}
        <Paper elevation={4} className={classes.moduleCard}>
            <Typography variant="h4">2. {t("Edit")}</Typography>
            {recording && <EditModule
                recording={recording}
                editCallback={newRecording => setRecording(newRecording)}
            />}
        </Paper >

        {/* Render */}
        <Paper elevation={4} className={classes.moduleCard}>
            <Typography variant="h4">3. {t("Export")}</Typography>
            {recording && <GifRenderModule recording={recording} />}
        </Paper >
        <AdsCard />

    </div >;
}
export default MainPage;
