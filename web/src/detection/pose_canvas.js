import {
    useEffect,
    useRef,
} from "react";

import paintPose from "./pose_painter.js";

const PoseCanvas = ({ className, pose, backgroundOpacity = 1, debugView = false }) => {
    const ref = useRef();
    useEffect(() => {
        if (!pose || !ref.current) return;
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        paintPose(ctx, pose, backgroundOpacity, debugView);
    }, [pose]);

    return <canvas
        className={className}
        ref={ref}
        width={pose?.videoWidth || 1}
        height={pose?.videoHeight || 1}
    >
    </canvas>;
};
// });
export default PoseCanvas;
