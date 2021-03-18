import {
    useState,
} from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
    Button, Paper, Typography
} from "@material-ui/core";
import PageTemplate from "./page_template.js";

import RecorderModule from "../components/recorder_module.js";
import EditModule from "../components/edit_module.js";
import ExportModule from "../components/export_module.js";
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';

import { TwitterFollowButton } from 'react-twitter-embed';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon
} from 'react-share';

const useStyles = makeStyles((theme) => ({
    root: {
        // margin: "24px",
    },
    descriptionCard: {
    },
    moduleCard: {
        marginTop: "24px",
        padding: "8px",
    },
    largeGif: {
        maxWidth: "100%",
    }
}));

function PageDescription() {
    const classes = useStyles();
    const { t } = useTranslation();

    return <div className={classes.descriptionCard}>
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
                    The entire website is <a href="https://github.com/kenkawakenkenke/stickfigure-recorder" target="_blank" rel="noreferrer">open sourced on Github.</a>
                </Trans>
            </p>
            <div>
                <TwitterFollowButton screenName={'kenkawakenkenke'} />
                <FacebookShareButton url={["http://stickfigure-recorder.web.app/"]} quote={[t("SNS Share text")]}>
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                    url={["http://stickfigure-recorder.web.app/"]}
                    title={[t("Twitter Share text")]}>
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
            </div>
        </div>
    </div >
}

function MainPage() {
    const classes = useStyles();
    const { t } = useTranslation();

    const [recording, setRecording] = useState();

    const doReset = () => {
        setRecording(undefined);
    }
    return <PageTemplate>
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
            {recording && <ExportModule recording={recording} />}
        </Paper >
    </PageTemplate >;
}
export default MainPage;
