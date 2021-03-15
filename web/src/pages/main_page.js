import {
    useEffect,
    useRef,
    useState,
    forwardRef,
} from "react";
import { makeStyles } from '@material-ui/core/styles';

import RecorderModule from "../components/recorder_module.js";
import GifRenderModule from "../components/gif_render_module.js";

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

function MainPage() {
    const classes = useStyles();

    const [recording, setRecording] = useState();

    const doReset = () => {
        setRecording(undefined);
    }
    return <div>
        {!recording && <RecorderModule recordingCallback={newRecording => setRecording(newRecording)} />}
        {recording &&
            <button onClick={doReset}>Reset</button>}
        {recording && <GifRenderModule recording={recording} />}
    </div>;
}
export default MainPage;
