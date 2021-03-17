import {
    useEffect,
    useRef,
} from "react";

import paintFrame from "./pose_painter.js";

const PoseCanvas = ({ className, frame, backgroundOpacity = 1, debugView = false }) => {
    const ref = useRef();
    useEffect(() => {
        if (!frame || !ref.current) return;
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        paintFrame(ctx, frame, backgroundOpacity, debugView);
    }, [frame]);

    return <canvas
        className={className}
        ref={ref}
        width={frame?.videoWidth || 1}
        height={frame?.videoHeight || 1}
    >
    </canvas>;
};
// });
export default PoseCanvas;
