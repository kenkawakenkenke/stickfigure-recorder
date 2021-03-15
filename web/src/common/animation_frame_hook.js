import {
    useEffect,
    useRef,
} from "react";

const useAnimationFrame = (callback, allowAnimate) => {
    const animationKillFlag = useRef(false);
    const previousTimeRef = useRef();

    const animate = async time => {
        if (animationKillFlag.current) {
            return;
        }
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;
            await callback(deltaTime);
        }
        previousTimeRef.current = time;
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