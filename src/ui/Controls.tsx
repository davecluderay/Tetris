import { useCallback, useEffect, useRef } from "react";

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
    const stateRef = useRef<{startTime: number, startX: number, startY: number}>();
    const onTouchStart = useCallback((e: TouchEvent) => {
        const touch = e.touches?.[0] ?? e.changedTouches[0];
        stateRef.current = {
            startTime: e.timeStamp,
            startX: touch.clientX,
            startY: touch.clientY
        };
    }, []);
    const onTouchEnd = useCallback((e: TouchEvent) => {
        const state = stateRef.current!;
        const touch = e.touches?.[0] ?? e.changedTouches[0];
        const [radiusX, radiusY] = [touch.radiusX, touch.radiusY];
        const [deltaX, deltaY] = [touch.clientX - state.startX, touch.clientY - state.startY];
        const time = e.timeStamp - state.startTime;
        if (Math.abs(deltaX / deltaY) > 2) {
            if (deltaX < -radiusX && time < 500) { onLeft(); }
            if (deltaX > radiusX && time < 500) { onRight(); }
        }
        else if (Math.abs(deltaX / deltaY) < 0.5) {
            if (deltaY > radiusY && time < 500) { onDown(); }
        }
        else if (time < 250) {
            const width = (e.target as HTMLElement).clientWidth;
            if (touch.clientX < width / 2) { onRotateLeft(); }
            if (touch.clientX > width / 2) { onRotateRight(); }
            onStart();
        }
        stateRef.current = undefined;
    }, [onLeft, onRight, onDown, onRotateLeft, onRotateRight, onStart]);
    useEffect(() => {
        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchend', onTouchEnd);
        return () => {
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [onTouchStart, onTouchEnd]);
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