import './TetrisGame.css';
import { Canvas } from "@react-three/fiber";
import { PlayArea } from './PlayArea';
import { Brick } from './Brick';
import { useCallback, useMemo, useReducer, useState } from 'react';
import { TetrisGame as CoreGame } from '../game/TetrisGame';
import { Brick as CoreBrick } from '../game/PlayArea';
import { Tetromino } from './Tetromino';
import { PreviewArea } from './PreviewArea';
import { ScoreArea } from './ScoreArea';
import { Controls, useTouchControls } from './Controls';
import { useEffect } from 'react';
import { BrickColour } from '../game/SharedTypes';
import { RowOfBricks } from '../game/PlayArea';
import { GameOver } from './GameOver';
import { CameraView } from './CameraView';
import { ControlsHelp } from './ControlsHelp';
import { musicControlPromise } from '../audio/TetrisMusic/TetrisMusic';
import { sfxControlPromise } from '../audio/Sfx';

type DestroyedBrick = {
    id: number,
    colour: BrickColour,
    position: [x: number, y: number, z: number],
    rotation: [x: number, y: number, z: number],
    scale: number
};

function calculateTickInterval(tetrominoCount: number) {
    const [min, max] = [200, 700];
    const t = 1 - Math.min(tetrominoCount / 200, 1);
    return Math.trunc(min + (max - min) * t);
}

function calculateBpm(tetrominoCount: number) {
    const [min, max] = [140, 200];
    const t = Math.min(tetrominoCount / 200, 1);
    return Math.trunc(min + (max - min) * t);
}

function TetrisGame() {
    const game = useMemo(() => new CoreGame(), []);
    const [tetrominoCount, setTetrominoCount] = useState(0);
    const [gameCount, incrementGameCount] = useReducer((n: number) => n + 1, 0);
    const tickInterval = useMemo(() => calculateTickInterval(tetrominoCount), [tetrominoCount]);
    const musicBpm = useMemo(() => calculateBpm(tetrominoCount), [tetrominoCount]);
    const [destroyedBricks, setDestroyedBricks] = useState<DestroyedBrick[]>([]);
    const { active } = game;

    const [, reRender] = useReducer((n: number) => n + 1, 0);

    const onBricksLocked = useCallback(() => {
        sfxControlPromise.then(sfx => sfx.playImpactSound());
        setTetrominoCount(n => n + 1);
     }, []);
    const onBricksDestroyed = useCallback((bricks: CoreBrick[]) => {
        sfxControlPromise.then(sfx => sfx.playExplosionSound());
        setDestroyedBricks(bricks.map(b => {
                const [x, y] = b.position;
                const [px, py, pz] = [(x + Math.random() * 10) - 5, ((y + Math.random() * 10) - 5), 1];
                const [rx, ry, rz] = [Math.random() * 6 * Math.PI, Math.random() * 6 * Math.PI, Math.random() * 6 * Math.PI];
                return { id: b.id, colour: b.colour, position: [px, py, pz], rotation: [rx, ry, rz], scale: 0 } as DestroyedBrick;
            }));
    }, []);
    const onRowsDestroyed = useCallback((destroyed: RowOfBricks[]) => {
        onBricksDestroyed(destroyed.reduce<Array<CoreBrick>>((a, d) => [...a, ...d.bricks], []));
    }, [onBricksDestroyed]);
    const onGameOver = useCallback(() => {
        musicControlPromise.then(m => m.stop());
    }, []);

    useEffect(() => {
        let timeout: number | undefined = undefined;
        const tick = () => {
            if (timeout) {
                game.tick({ onBricksLocked, onRowsDestroyed, onGameOver });
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
    }, [game, tickInterval, onBricksLocked, onRowsDestroyed, onGameOver, gameCount]);

    useEffect(() => {
        musicControlPromise.then(m => m.setBpm(musicBpm));
    }, [musicBpm]);

    const bricks = useMemo(() => {
        if (tetrominoCount < 0) return [];
        const intact = [...game.playArea.getBricks()].map(brick => <Brick key={brick.id} position={[...brick.position, 0]} colour={brick.colour} />);
        const destroyed = destroyedBricks.map(brick => <Brick key={brick.id} {...brick} />);
        return [...intact, ...destroyed];
    }, [game.playArea, destroyedBricks, tetrominoCount]);

    const gameOver = game.isOver ? <GameOver beforeFirstGame={!gameCount} position={[5, 10, 2.01]} /> : undefined;
    const activeTetromino = game.isOver ? undefined : <Tetromino key={tetrominoCount} colour={active.colour} layout={active.baseLayout} position={[...active.position, 0.001]} rotationZ={-active.rotation} />;

    const onLeft = useCallback(() => { game.left(); reRender(); }, [game, reRender]);
    const onRight = useCallback(() => { game.right(); reRender(); }, [game, reRender]);
    const onDown = useCallback(() => { game.down(); reRender(); }, [game, reRender]);
    const onRotateLeft = useCallback(() => { game.rotateLeft(); reRender(); }, [game, reRender]);
    const onRotateRight = useCallback(() => { game.rotateRight(); reRender(); }, [game, reRender]);
    const onStart = useCallback(() => {
        if (game.isOver) {
            musicControlPromise.then(m => {
                m.start(musicBpm);
                onBricksDestroyed([...game.playArea.getBricks()]);
                incrementGameCount();
                setTetrominoCount(0);
                game.start();
                reRender();
            });
        }
    }, [game, onBricksDestroyed, incrementGameCount, reRender, musicBpm]);

    useTouchControls(onLeft, onRight, onDown, onRotateLeft, onRotateRight, onStart);

    return (
        <Canvas className="TetrisGame">
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, -10, 10]} intensity={2} />
            <CameraView />
            <PlayArea position={[0, 0, 0]} width={10} height={20} rotation={gameCount}>
                {bricks}
                {activeTetromino}
            </PlayArea>
            <PreviewArea position={[11, 15, 0]} current={game.next} />
            <ScoreArea position={[16, 14.5, 1]} score={game.score} />
            <ControlsHelp position={[-1, 5.5, 1]} />
            {gameOver}
            <Controls onLeft={onLeft} onRight={onRight} onDown={onDown} onRotateLeft={onRotateLeft} onRotateRight={onRotateRight} onStart={onStart} />
        </Canvas>
    )
}

export { TetrisGame };