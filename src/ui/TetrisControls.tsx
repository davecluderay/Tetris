import { useEffect } from "react";

type TetrisControlsProps = {
    target?: HTMLElement | undefined,
    onLeft: () => void,
    onRight: () => void,
    onDown: () => void,
    onRotateLeft: () => void,
    onRotateRight: () => void
}

export function TetrisControls(props: TetrisControlsProps) {
    function handleKeyboardEvent(e: KeyboardEvent) {
        switch (e.code) {
            case 'ArrowLeft':
                props.onLeft();
                break;
            case 'ArrowRight':
                props.onRight();
                break;
            case 'ArrowDown':
                props.onDown();
                break;
            case 'KeyZ':
                props.onRotateLeft();
                break;
            case 'KeyX':
                props.onRotateRight();
                break;
        }
    }

    useEffect(() => {
        const t = props.target ?? window;
        const handler = (e: Event) => handleKeyboardEvent(e as KeyboardEvent);
        t.addEventListener('keydown', handler);
        return () => t.removeEventListener('keydown', handler);
    }, Object.values(props))
    return <></>;
}