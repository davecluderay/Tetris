import { useDrag } from "@use-gesture/react";
import { useCallback, useEffect } from "react";

type ActionCallback = () => void;

type ControlsProps = {
    target?: HTMLElement | undefined,
    onLeft: ActionCallback,
    onRight: ActionCallback,
    onDown: ActionCallback,
    onRotateLeft: ActionCallback,
    onRotateRight: ActionCallback,
    onStart: ActionCallback
}

export function useTouchControls(onLeft: ActionCallback, onRight: ActionCallback, onDown: ActionCallback, onRotateLeft: ActionCallback, onRotateRight: ActionCallback, onStart: ActionCallback) {
    return useDrag(e => {
        const [x, y] = e.swipe;
        if (Math.abs(x) > Math.abs(y)) {
            if (x < 0)
                onLeft();
            else if (x > 0)
                onRight();
        }
        if (Math.abs(y) > Math.abs(x)) {
            if (y > 0)
                onDown();
        }
        if (e.tap) {
            const [x,] = e.values;
            const w = (e.currentTarget as HTMLBaseElement).clientWidth;
            if (x < w / 2.2)
                onRotateLeft();
            else if (x > w / 1.8)
                onRotateRight();
            onStart();
        }
    },
    {
        preventDefault: true
    });
}

export function Controls({ target, onLeft, onRight, onDown, onRotateLeft, onRotateRight, onStart }: ControlsProps) {
    const handleKeyboardEvent = useCallback((e: KeyboardEvent) => {
        switch (e.code) {
            case 'ArrowLeft':
                onLeft();
                break;
            case 'ArrowRight':
                onRight();
                break;
            case 'ArrowDown':
                onDown();
                break;
            case 'KeyZ':
                onRotateLeft();
                break;
            case 'KeyX':
                onRotateRight();
                break;
            case 'KeyS':
                onStart();
                break;
        }
    }, [onLeft, onRight, onDown, onRotateLeft, onRotateRight, onStart]);

    useEffect(() => {
        const t = target ?? window;
        const handler = (e: Event) => handleKeyboardEvent(e as KeyboardEvent);
        t.addEventListener('keydown', handler);
        return () => t.removeEventListener('keydown', handler);
    }, [target, handleKeyboardEvent])
    return <></>;
}