import {
    useEffect,
    useRef,
    useState,
    forwardRef,
} from "react";

import paintPose from "./pose_painter.js";

const PoseCanvas = ({ className, pose, backgroundOpacity = 1 }) => {
    const ref = useRef();
    useEffect(() => {
        if (!pose || !ref.current) return;
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        paintPose(ctx, pose, backgroundOpacity);
    }, [pose]);

    return <canvas
        className={className}
        ref={ref}
        width={pose?.videoWidth || 100}
        height={pose?.videoHeight || 100}
    >
    </canvas>;
};
// });
export default PoseCanvas;
