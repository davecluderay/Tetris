import './TetrisGame.css';
import { Canvas } from "@react-three/fiber";
import { PlayArea } from './PlayArea';
import { Brick } from './Brick';
import { useMemo, useReducer } from 'react';
import { TetrisGame as Game } from '../game/TetrisGame'
import { Tetromino } from './Tetromino';
import { PreviewArea } from './PreviewArea';
import { ScoreArea } from './ScoreArea';
import { Controls } from './Controls';
import { useEffect } from 'react';

type TetrisGameProps = {
    showAxes?: boolean
}

function calculateTickInterval(tetrominoCount: number) {
    const [min, max] = [200, 800];
    const t = 1 - Math.min(tetrominoCount / 500, 1);
    return min + (max - min) * t;
}

function TetrisGame(props: TetrisGameProps) {
    const game = useMemo(() => new Game(), []);
    const [tetrominoCount, IncrementTetrominoCount] = useReducer(n => n + 1, 0);
    const tickInterval = useMemo(() => calculateTickInterval(tetrominoCount), [tetrominoCount])
    const { active } = game;

    const [, reRender] = useReducer(n => n + 1, 0);

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined = undefined;
        const tick = () => {
            if (timeout) {
                game.tick({
                    onBricksLocked: () => {
                        IncrementTetrominoCount();
                    },
                    onRowsDestroyed: () => {
                    },
                    onGameOver: () => {
                    }
                });
                reRender();
            }
            if (!game.isOver) {
                timeout = setTimeout(tick, tickInterval);
            }
        }
        tick();
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    }, [game, tickInterval]);

    const bricks = useMemo(() => {
        const source = [...game.playArea.getBricks()];
        return source.map(brick => <Brick key={brick.id} position={[...brick.position, 0]} colour={brick.colour} />);
    }, [game.playArea, tetrominoCount]);

    return (
        <Canvas className="TetrisGame" orthographic camera={{ zoom: 35, position: [0, 15, 30], far: 100, near: 20 }} onCreated={state => state.camera.lookAt(5, 10, 0)}>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, -10, 10]} intensity={0.75} />
            <PlayArea position={[0, 0, 0]} width={10} height={20}>
                {bricks}
                <Tetromino key={tetrominoCount} colour={active.colour} layout={active.baseLayout} position={[...active.position, 0.001]} rotationZ={-active.rotation} />
            </PlayArea>
            <PreviewArea position={[11, 15, 0]} current={game.next} />
            <ScoreArea position={[16, 14.5, 1]} score={game.score} />
            <Controls
                onLeft={() => { game.left(); reRender(); }}
                onRight={() => { game.right(); reRender(); }}
                onDown={() => { game.down(); reRender(); }}
                onRotateLeft={() => { game.rotateLeft(); reRender(); }}
                onRotateRight={() => { game.rotateRight(); reRender(); }} />
        </Canvas>
    )
}

export { TetrisGame };