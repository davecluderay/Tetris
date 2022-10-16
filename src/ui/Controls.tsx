import { useCallback, useEffect } from "react";

type ControlsProps = {
    target?: HTMLElement | undefined,
    onLeft: () => void,
    onRight: () => void,
    onDown: () => void,
    onRotateLeft: () => void,
    onRotateRight: () => void,
    onStart: () => void
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