import {
    useEffect,
    useState,
} from "react";
import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs-backend-webgl';

function usePosenet() {
    const [loadedPosenet, setLoadedPosenet] = useState();
    useEffect(() => {
        if (loadedPosenet) return;
        (async () => {
            const net = await posenet.load({
                architecture: 'ResNet50',
                outputStride: 32,
                inputResolution: { width: 257, height: 200 },
                quantBytes: 2
            });
            setLoadedPosenet(net);
        })();
    }, [loadedPosenet]);
    return loadedPosenet;
}
export default usePosenet;