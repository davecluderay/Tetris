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

type TetrisGameProps = {
    showAxes?: boolean
}

function TetrisGame(props: TetrisGameProps) {
    const game = useMemo(() => new Game(), []);
    const { active } = game;

    const [, reRender] = useReducer(n => n + 1, 0);

    const bricks = useMemo(() => {
        const source = [...game.playArea.getBricks()];
        return source.map((brick, i) => <Brick key={i} position={[...brick.position, 0]} colour={brick.brickColour} />);
    }, [game.playArea]);

    return (
        <Canvas className="TetrisGame" orthographic camera={{ zoom: 35, position: [0, 15, 30], far: 100, near: 20 }} onCreated={state => state.camera.lookAt(5, 10, 0)}>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, -10, 10]} intensity={0.75} />
            <PlayArea position={[0, 0, 0]} width={10} height={20}>
                {bricks}
                <Tetromino colour={active.colour} layout={active.baseLayout} position={[...active.position, 0.001]} rotationZ={-active.rotation} />
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