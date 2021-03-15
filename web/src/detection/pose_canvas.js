import {
    useEffect,
    useRef,
    useState,
    forwardRef,
} from "react";

import paintPose from "./pose_painter.js";

const PoseCanvas = ({ className, width, height, pose }) => {
    const ref = useRef();
    useEffect(() => {
        if (!pose || !ref.current) return;
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        paintPose(ctx, pose);
    }, [pose]);

    return <canvas
        className={className}
        ref={ref}
        width={width}
        height={height}></canvas>;
};
// });
export default PoseCanvas;
