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
}));

function PageDescription() {
    const classes = useStyles();
    return <div className={classes.descriptionCard}>
        <Typography variant="h3">Stickfigure Recorder</Typography>
        Create animated stickfigure gifs just by recording youself with your webcam!

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
