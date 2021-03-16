import {
    useEffect,
    useRef,
} from "react";

const useAnimationFrame = (callback, allowAnimate, fps, dependencies = []) => {
    const outputEveryMs = 1000 / fps;

    const animationKillFlag = useRef(false);
    const timeStartRef = useRef();
    const prevOutputTimeRef = useRef();
    const animationRequestRef = useRef();
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
        if (!animationKillFlag.current) {
            animationRequestRef.current = requestAnimationFrame(animate);
        }
    }

    useEffect(() => {
        console.log("useAnimationFrame");
        if (!allowAnimate) {
            return;
        }
        animationKillFlag.current = false;
        animationRequestRef.current = requestAnimationFrame(animate);
        return () => {
            animationKillFlag.current = true;
            cancelAnimationFrame(animationRequestRef.current);
        }
    }, [...dependencies, allowAnimate]);
};
export default useAnimationFrame;