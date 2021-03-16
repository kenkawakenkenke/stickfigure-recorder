import {
    useRef,
    useState,
} from "react";
import {
    Button, Checkbox, FormControlLabel, FormControl, RadioGroup, Radio, FormLabel
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import PoseCanvas from "../detection/pose_canvas.js";
import useAnimationFrame from "../common/animation_frame_hook.js";
import CameraVideo from "../detection/camera_reader.js";
import usePosenet, { posenetConfigs } from "../detection/posenet_hook.js";
import FeatureSmoother from "../detection/smoother.js";
import Loader from 'react-loader-spinner';
import { normalizeTime } from "../detection/recording_editor.js";
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
        // backgroundColor: "#bbbbff",
        // width: "100%",
    },
    canvasContainer: {
        marginTop: "8px",
        marginBottom: "8px",
        padding: "8px",
        display: "inline-block",
    },
    canvasParent: {
        position: "relative",
        display: "inline-block",
    },
    videoCanvas: {
        width: "80%",
        height: "80%",
    },
    canvas: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "80%",
    },
    canvasWhenDebug: {
        position: "absolute",
        top: "0px",
        left: "100px",
        width: "80%",
    },
    debugCanvas: {
        position: "absolute",
        top: "0",
        left: "200px",
    },
    poses: {
        // backgroundColor: "red",
        // width: "400px",
    }
}));

function useRecording(posenet, videoElement, isRecording, smoothingWindow) {
    const { t, i18n } = useTranslation();
    const [recording, setRecording] = useState({
        poses: [],
    });

    // Return a "waiting" message if we're told to record but we're not ready.
    const loadingMessage = isRecording && (!posenet || !videoElement) ?
        (t("Waiting for") +
            [!posenet && t("PoseNet"),
            !videoElement && t("video")]
                .filter(x => x)
                .join(", "))
        : undefined;

    const smoothersRef = useRef({});
    useAnimationFrame(async (timeSinceLastFrameMs, timeSinceStartMs, killRef) => {
        const net = posenet;
        videoElement.width = videoElement.videoWidth;
        videoElement.height = videoElement.videoHeight;
        const pose = await net.estimateSinglePose(videoElement);
        pose.videoWidth = videoElement.videoWidth;
        pose.videoHeight = videoElement.videoHeight;
        pose.t = timeSinceStartMs;

        // Smoothing
        pose.keypoints.forEach(feature => {
            let smoother = smoothersRef.current[feature.part];
            if (!smoother) {
                smoothersRef.current[feature.part] = smoother = new FeatureSmoother(smoothingWindow);
            }
            smoother.add(feature.position);
            const smoothed = smoother.smoothed();
            feature.position = smoothed;
        });
        if (killRef.current) {
            return;
        }
        if (timeSinceStartMs === 0) {
            // skip: the first frame is always weird (has a huge lag)
            return;
        }
        setRecording(prevRecording => ({
            poses: [...prevRecording.poses, {
                ...pose,
                frameIndex: prevRecording.poses.length,
            }],
        }));
    }, isRecording && posenet && videoElement,
        /* fps= */ 12);
    return [recording, loadingMessage];
}

const SMOOTHING_WINDOW = 4;
function RecorderModule({ recordingCallback }) {
    const classes = useStyles();
    const { t, i18n } = useTranslation();

    const [isRecording, setIsRecording] = useState(false);

    const [posenetLevel, setPosenetLevel] = useState("high");
    const posenet = usePosenet(posenetLevel);
    const [videoElement, setVideoElement] = useState();
    const [recording, loadingMessage] = useRecording(posenet, videoElement, isRecording, SMOOTHING_WINDOW);

    const startRecord = () => {
        setIsRecording(true);
    };
    const stopRecord = () => {
        setIsRecording(false);

        // Final tweaks before saving.
        let tweakedRecording = JSON.parse(JSON.stringify(recording));
        tweakedRecording.firstFrame = 0;
        tweakedRecording.lastFrame = tweakedRecording.poses.length - 1;
        // Give frame numbers to each pose
        // tweakedRecording.poses.forEach((pose, index) => pose.frameIndex = index);
        // Ensure time always starts at 0.
        normalizeTime(tweakedRecording);

        // Notify parent.
        recordingCallback(tweakedRecording);
    };

    const [debugView, setDebugView] = useState(false);
    return <div className={classes.root}>

        <div>
            {!isRecording && <div>
                <div>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{t("PosenetAccuracy")}</FormLabel>
                        <RadioGroup row aria-label="gender" value={posenetLevel} onChange={(event) => setPosenetLevel(event.target.value)}>
                            {Object.keys(posenetConfigs).map(config =>
                                <FormControlLabel key={`config_${config}`} value={config} control={<Radio />} label={t(`PosenetAccuracy_${config}`)} />
                            )}
                        </RadioGroup>
                    </FormControl>
                </div>
                {!posenet && <div>
                    {t("Loading PoseNet")}
                    <Loader type="Oval" color="#888888" height={48} width={48}></Loader></div>}
                <Button disabled={!posenet} onClick={startRecord} variant="contained" color="primary">{t("Record!")}</Button>
            </div>}
            {isRecording && recording.poses.length > 0 && <Button onClick={stopRecord} variant="contained" color="primary">{t("Stop")}</Button>}
        </div>

        {
            isRecording &&
            <div className={classes.canvasContainer}>
                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={debugView}
                                onChange={(event) => setDebugView(event.target.checked)}
                                name="chkDebugView"
                                color="primary"
                            />
                        }
                        label={t("Debug view")}
                    />
                </div>
                <div className={classes.canvasParent}>
                    {loadingMessage && <div>
                        {loadingMessage}
                        <Loader type="Oval" color="#888888" height={48} width={48}></Loader>
                    </div>}

                    <CameraVideo
                        className={classes.videoCanvas}
                        doLoad={isRecording}
                        readyCallback={(video) => setVideoElement(video)} />
                    {debugView && <PoseCanvas
                        className={debugView ? classes.canvasWhenDebug : classes.canvas}
                        pose={recording && recording.poses.length && recording.poses[recording.poses.length - 1]}
                        backgroundOpacity={debugView ? 0 : 0.5}
                        debugView={true}
                    />}
                    <PoseCanvas
                        className={debugView ? classes.debugCanvas : classes.canvas}
                        pose={recording && recording.poses.length && recording.poses[recording.poses.length - 1]}
                        backgroundOpacity={debugView ? 0 : 0.5}
                        debugView={false}
                    />
                </div>
            </div>
        }

        {/* Mini viewer */}
        {/* <div className={classes.poses}>
            <RecordingsView
                recording={recording}
                outEvery={12} />
        </div> */}
    </div >;
}
export default RecorderModule;
