import {
    useRef,
    useState,
} from "react";
import {
    Button, Checkbox, FormControlLabel, FormControl, RadioGroup, Radio, FormLabel, Slider
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import PoseCanvas from "../detection/pose_canvas.js";
import useAnimationFrame from "../common/animation_frame_hook.js";
import CameraVideo from "../detection/camera_reader.js";
import usePosenet, { posenetConfigs } from "../detection/posenet_hook.js";
import PoseSmoother from "../detection/smoother.js";
import Loader from 'react-loader-spinner';
import { normalizeTime } from "../detection/recording_editor.js";
import { useTranslation } from 'react-i18next';

import { distBetween } from "../detection/point_util.js";

const DEFAULT_FRAMERATE = 12;
const useStyles = makeStyles((theme) => ({
    root: {
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
    },
    formControl: {
        marginTop: "8px",
        borderTop: "solid #dddddd 1px",
    },
    recordButtonContainer: {
        display: "flex",
        alignItems: "center",
    },
    loader: {
        display: "flex",
        alignItems: "center",
    },
    loaderSpinner: {
        margin: "4px",
    }
}));

function distBetweenSmootherAndPose(poseSmoother, pose) {
    let sumDist = 0;
    let n = 0;
    pose.keypoints
        .filter(feature => feature.score > 0.5)
        .forEach(feature => {
            let featureSmoother = poseSmoother.smoother(feature);
            if (featureSmoother.num() === 0) {
                return;
            }
            const smoothed = featureSmoother.smoothed();
            const dist = distBetween(feature.position, smoothed);
            sumDist += dist;
            n++;
        });
    if (n === 0) {
        return undefined;
    }
    return sumDist / n;
}

function performSmoothing(poses, poseSmoothersRef, smoothingWindow) {
    // Here, we do a greedy match between known smoothers against the new poses.
    // We first do an O(n^2) matching between smoothers and poses, and then
    // pair the smoothers and poses from the shortest (average) distance pairs first,
    // ticking off already used smoothers and poses.
    const poseSmootherPairs = [];
    poses.forEach((pose, poseIndex) => {
        poseSmoothersRef.current.forEach((smoother, smootherIndex) => {
            const dist = distBetweenSmootherAndPose(smoother, pose);
            poseSmootherPairs.push({
                poseIndex,
                smootherIndex,
                dist,
            });
        });
    });
    poseSmootherPairs.sort((i, j) => i.dist - j.dist);

    const usedPoses = {};
    const usedSmoothers = {};
    poseSmootherPairs.forEach(({ poseIndex, smootherIndex, dist }) => {
        if (usedPoses[poseIndex]) return;
        if (usedSmoothers[smootherIndex]) return;

        poseSmoothersRef.current[smootherIndex].smooth(poses[poseIndex]);
        poses[poseIndex].smoother = poseSmoothersRef.current[smootherIndex].name;

        usedPoses[poseIndex] = true;
        usedSmoothers[smootherIndex] = true;
    });

    // Purge unused smoothers
    // const purged
    poseSmoothersRef.current = poseSmoothersRef.current
        .filter((smoother, smootherIndex) => usedSmoothers[smootherIndex]);

    // Finally add smoothers for poses that haven't yet found a smoother pair (i.e probably new poses).
    poses
        .filter((pose, poseIndex) => !usedPoses[poseIndex])
        .forEach(pose => {
            const smoother = new PoseSmoother(smoothingWindow);
            smoother.name = `smoother_${poseSmoothersRef.current.length}`;
            poseSmoothersRef.current.push(smoother);
            smoother.smooth(pose);
        });
}

async function singlePoseDetection(posenet, videoElement) {
    const pose = await posenet.estimateSinglePose(videoElement);
    return [pose];
}

async function multiPoseDetection(posenet, videoElement) {
    return posenet.estimateMultiplePoses(videoElement, {
        flipHorizontal: false,
        maxDetections: 5,
        scoreThreshold: 0.5,
        nmsRadius: 20
    });
}

function useRecording(posenet, videoElement, isRecording, smoothingWindow, allowMultiplePoses) {
    const { t } = useTranslation();
    const [recording, setRecording] = useState({
        frames: [],
    });

    // Return a "waiting" message if we're told to record but we're not ready.
    const loadingMessage = isRecording && (!posenet || !videoElement) ?
        (t("Waiting for") +
            [!posenet && t("PoseNet"),
            !videoElement && t("video")]
                .filter(x => x)
                .join(", "))
        : undefined;

    const smoothersRef = useRef([]);
    useAnimationFrame(async (timeSinceLastFrameMs, timeSinceStartMs, isDead) => {
        const net = posenet;
        videoElement.width = videoElement.videoWidth;
        videoElement.height = videoElement.videoHeight;
        const frame = {};
        if (allowMultiplePoses) {
            frame.poses = await multiPoseDetection(net, videoElement);
        } else {
            frame.poses = await singlePoseDetection(net, videoElement);
        }
        performSmoothing(frame.poses, smoothersRef, smoothingWindow);

        frame.videoWidth = videoElement.videoWidth;
        frame.videoHeight = videoElement.videoHeight;
        frame.t = timeSinceStartMs;

        if (isDead()) {
            return;
        }
        if (timeSinceStartMs === 0) {
            // skip: the first frame is always weird (has a huge lag)
            return;
        }
        setRecording(prevRecording => ({
            frames: [...prevRecording.frames, {
                ...frame,
                frameIndex: prevRecording.frames.length,
            }],
        }));
    },
        /* allowAnimate= */ isRecording && posenet && videoElement,
        /* fps= */ DEFAULT_FRAMERATE,
    /* dependencies= */[videoElement]);
    // Note: we don't include smoothingWindow and allowMultiplePoses in dependencies because
    // these never change while the animation is running.
    return [recording, loadingMessage];
}

function RecorderModule({ recordingCallback }) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [isRecording, setIsRecording] = useState(false);

    // Recording settings
    const [posenetLevel, setPosenetLevel] = useState("high");
    const [smoothingWindow, setSmoothingWindow] = useState(4);
    const [allowMultiplePoses, setAllowMultiplePoses] = useState(false);

    const posenet = usePosenet(posenetLevel);
    const [videoElement, setVideoElement] = useState();
    const [recording, loadingMessage] = useRecording(posenet, videoElement, isRecording, smoothingWindow, allowMultiplePoses);

    const startRecord = () => {
        setIsRecording(true);
    };
    const stopRecord = () => {
        setIsRecording(false);

        // Final tweaks before saving.
        let tweakedRecording = JSON.parse(JSON.stringify(recording));
        tweakedRecording.firstFrame = 0;
        tweakedRecording.lastFrame = tweakedRecording.frames.length - 1;
        // Ensure time always starts at 0.
        normalizeTime(tweakedRecording);
        tweakedRecording.framerate = DEFAULT_FRAMERATE;
        tweakedRecording.exportWidth = recording.frames[0].videoWidth;
        tweakedRecording.exportHeight = recording.frames[0].videoHeight;

        // Notify parent.
        recordingCallback(tweakedRecording);
    };

    const [debugView, setDebugView] = useState(false);
    return <div className={classes.root}>

        <div>
            {!isRecording && <div>
                <div>
                    <div className={classes.recordButtonContainer}>
                        <Button disabled={!posenet} onClick={startRecord} variant="contained" color="primary">{t("Record!")}</Button>
                        {!posenet && <div className={classes.loader}>
                            <Loader className={classes.loaderSpinner} type="Oval" color="#888888" height={48} width={48}></Loader>
                            {t("Loading PoseNet")}
                        </div>}
                    </div>

                    <div className={classes.formControl}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">{t("PosenetAccuracy")}</FormLabel>
                            <RadioGroup row aria-label="gender" value={posenetLevel} onChange={(event) => setPosenetLevel(event.target.value)}>
                                {Object.keys(posenetConfigs).map(config =>
                                    <FormControlLabel key={`config_${config}`} value={config} control={<Radio />} label={t(`PosenetAccuracy_${config}`)} />
                                )}
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className={classes.formControl}>
                        <FormControlLabel control={<Checkbox
                            checked={allowMultiplePoses}
                            onChange={(event) => setAllowMultiplePoses(event.target.checked)}
                            name="checkedF" />} label={t("Allow multiple people estimation")} />
                    </div>
                    <div className={classes.formControl}>
                        <FormControl className={classes.formControl} component="fieldset">
                            <FormLabel component="legend">{t("Smoothing window")}</FormLabel>
                            <Slider
                                value={smoothingWindow}
                                onChange={(e, newValue) => setSmoothingWindow(newValue)}
                                valueLabelDisplay="auto"
                                ticks={1}
                                min={1}
                                max={DEFAULT_FRAMERATE * 2}
                            ></Slider>
                        </FormControl>
                    </div>
                </div>
            </div>}
            {isRecording && recording.frames.length > 0 && <Button onClick={stopRecord} variant="contained" color="primary">{t("Stop")}</Button>}
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
                    {loadingMessage && <div className={classes.loader}>
                        <Loader className={classes.loaderSpinner} type="Oval" color="#888888" height={48} width={48}></Loader>
                        {loadingMessage}
                    </div>}

                    {isRecording && <CameraVideo
                        className={classes.videoCanvas}
                        readyCallback={setVideoElement} />}
                    {debugView && <PoseCanvas
                        className={debugView ? classes.canvasWhenDebug : classes.canvas}
                        frame={recording && recording.frames.length && recording.frames[recording.frames.length - 1]}
                        backgroundOpacity={debugView ? 0 : 0.5}
                        debugView={true}
                    />}
                    <PoseCanvas
                        className={debugView ? classes.debugCanvas : classes.canvas}
                        frame={recording && recording.frames.length && recording.frames[recording.frames.length - 1]}
                        backgroundOpacity={debugView ? 0 : 0.5}
                        debugView={false}
                    />
                </div>
            </div>
        }
    </div >;
}
export default RecorderModule;
