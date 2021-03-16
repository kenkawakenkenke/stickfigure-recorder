import {
    useEffect,
    useRef,
    useState,
    forwardRef,
} from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
    Button, Paper, Typography
} from "@material-ui/core";

import RecorderModule from "../components/recorder_module.js";
import EditModule from "../components/edit_module.js";
import GifRenderModule from "../components/gif_render_module.js";

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
        <Typography variant="h3">Stickfigure Recorder</Typography>

        <div>
            <img src="/imgs/small_dance.gif" className={classes.smallGif} />
            <img src="/imgs/small_exercise.gif" className={classes.smallGif} />
            <img src="/imgs/small_fighting.gif" className={classes.smallGif} />
            <img src="/imgs/small_running.gif" className={classes.smallGif} />
        </div>
        Create animated stickfigure gifs just by recording youself with your webcam!
        <div>
            <img src="/imgs/stickfigure_recording.gif" />
        </div>
        <div>
            <p>
                This uses Google's <a href="https://www.tensorflow.org/lite/examples/pose_estimation/overview" target="_blank">PoseNet</a> to estimate your pose from webcam images,
                and converts the output to stickfigures, which you can export as animated gifs.
                I made this when I needed lots of generic stickfigure gifs for <a href="https://open-ken.web.app/" target="_blank">another website</a>,
                but couldn't find any broad-enough collection of gifs.</p>
            <p>The entire website is open sourced here: </p>
            <a href="https://github.com/kenkawakenkenke/stickfigure-recorder" target="_blank"><img src="https://gh-card.dev/repos/kenkawakenkenke/stickfigure-recorder.svg" /></a>
            <AdsCard />
        </div>
    </div>
}

function MainPage() {
    const classes = useStyles();

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
            <Typography variant="h4">1. Record!</Typography>
            {!recording && <RecorderModule recordingCallback={newRecording => setRecording(newRecording)} />}
            {recording &&
                <Button onClick={doReset} variant="contained" color="secondary">
                    Start again
                </Button>}
        </Paper>

        {/* Edit */}
        <Paper elevation={4} className={classes.moduleCard}>
            <Typography variant="h4">2. Edit</Typography>
            {recording && <EditModule
                recording={recording}
                editCallback={newRecording => setRecording(newRecording)}
            />}
        </Paper >

        {/* Render */}
        <Paper elevation={4} className={classes.moduleCard}>
            <Typography variant="h4">3. Export</Typography>
            {recording && <GifRenderModule recording={recording} />}
        </Paper >

    </div >;
}
export default MainPage;
