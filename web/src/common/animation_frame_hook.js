import {
    useEffect,
    useRef,
} from "react";

const useAnimationFrame = (callback, allowAnimate, fps, dependencies = []) => {
    const outputEveryMs = 1000 / fps;

    const animationKillFlag = useRef({});
    const timeStartRef = useRef();
    const prevOutputTimeRef = useRef();
    const animationRequestRef = useRef();

    const animationIDAccum = useRef(100);
    useEffect(() => {
        if (!allowAnimate) {
            return;
        }
        const id = animationIDAccum.current;
        animationIDAccum.current++;
        const isDead = () => animationKillFlag.current[id];
        const markAsDead = () => animationKillFlag.current[id] = true;

        const animate = async time => {
            if (isDead()) {
                return;
            }
            if (!timeStartRef.current) {
                timeStartRef.current = time;
            }

            const prevOutputTimeRefValue = prevOutputTimeRef.current;
            const timeSinceLastOutput = time - prevOutputTimeRefValue;
            if (!fps || isNaN(timeSinceLastOutput) || timeSinceLastOutput >= outputEveryMs) {
                await callback(timeSinceLastOutput, time - timeStartRef.current, isDead);
                prevOutputTimeRef.current = time;
            }
            if (!isDead()) {
                animationRequestRef.current = { frame: requestAnimationFrame(animate), fps }
            }
        }

        animationRequestRef.current = { frame: requestAnimationFrame(animate), fps }
        return () => {
            // animationKillFlag.current[id] = true;
            markAsDead();
            cancelAnimationFrame(animationRequestRef.current.frame);
        }
    }, [...dependencies, allowAnimate, fps]);
};
export default useAnimationFrame;