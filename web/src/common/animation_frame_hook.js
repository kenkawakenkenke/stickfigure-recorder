import {
    useEffect,
    useRef,
} from "react";

const useAnimationFrame = (callback, allowAnimate, fps) => {
    const outputEveryMs = 1000 / fps;

    const animationKillFlag = useRef(false);
    const timeStartRef = useRef();
    const prevOutputTimeRef = useRef();
    const animate = async time => {
        if (animationKillFlag.current) {
            return;
        }
        if (!timeStartRef.current) {
            timeStartRef.current = time;
        }

        const timeSinceLastOutput = time - prevOutputTimeRef.current || outputEveryMs || 0;
        if (!fps || timeSinceLastOutput >= outputEveryMs) {
            await callback(timeSinceLastOutput, time - timeStartRef.current, animationKillFlag);
            prevOutputTimeRef.current = time;
        }
        requestAnimationFrame(animate);
    }

    useEffect(() => {
        if (!allowAnimate) {
            return;
        }
        animationKillFlag.current = false;
        requestAnimationFrame(animate);
        return () => {
            animationKillFlag.current = true;
        }
    }, [allowAnimate]);
};
export default useAnimationFrame;