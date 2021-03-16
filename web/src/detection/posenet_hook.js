import {
    useEffect,
    useState,
    useRef,
} from "react";
import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs-backend-webgl';

export const posenetConfigs = {
    low: {
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: 257,
        multiplier: 0.5,
        quantBytes: 4,
    },
    medium: {
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: 257,
        multiplier: 0.75,
        quantBytes: 4,
    },
    high: {
        architecture: 'ResNet50',
        outputStride: 32,
        inputResolution: 257,
        quantBytes: 4,
    },
    superHigh: {
        architecture: 'ResNet50',
        outputStride: 16,
        inputResolution: 257,
        quantBytes: 4,
    },
};

function usePosenet(posenetLevel) {
    const [loadedPosenet, setLoadedPosenet] = useState();

    const targetLevelRef = useRef(posenetLevel);
    useEffect(() => {
        if (loadedPosenet && loadedPosenet.posenetLevel === posenetLevel) {
            console.log("already loaded!", loadedPosenet.posenetLevel);
            return;
        }
        setLoadedPosenet(undefined);
        targetLevelRef.current = posenetLevel;
        console.log(posenetLevel, loadedPosenet);
        (async () => {
            console.log("start load", posenetLevel);
            const net = await posenet.load(posenetConfigs[posenetLevel]);
            console.log("finished load: ", posenetLevel, targetLevelRef.current);
            if (posenetLevel !== targetLevelRef.current) {
                console.log("stale load, aborting");
                return;
            }
            setLoadedPosenet({
                net,
                posenetLevel,
            });
        })();
    }, [loadedPosenet, posenetLevel]);
    return loadedPosenet?.net;
}
export default usePosenet;