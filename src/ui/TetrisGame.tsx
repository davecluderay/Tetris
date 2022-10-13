import './TetrisGame.css';
import { Canvas } from "@react-three/fiber";
import { PlayArea } from './PlayArea';
import { Brick } from './Brick';
import { ReactNode, useMemo } from 'react';
import { TetrisGame as Game } from '../game/TetrisGame'
import { produceRandomTetromino } from '../game/tetrominoes';
import { Tetromino } from './Tetromino';
import { PreviewArea } from './PreviewArea';
import { ScoreArea } from './ScoreArea';

type TetrisGameProps = {
    showAxes?: boolean
}

function TetrisGame(props: TetrisGameProps) {
    const game = useMemo(() => new Game(), []);
    const { active } = game;

    const bricks = useMemo(() => {
        const results: ReactNode[] = [];
        // for (const {brickColour: colour, position: [x, y] } of Array.from(game.playArea.getBricks())) {
        //     results.push(<Brick key={`${x}-${y}`} position={[x, y, 0]} colour={colour} />)
        // }
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 10; x++) {
                if (Math.random() * y < 1) {
                    results.push(<Brick key={`${x}-${y}`} position={[x, y, 0]} colour={produceRandomTetromino().colour} />);
                }
            }
        }
        return results;
    }, []);
    return (
        <Canvas className="TetrisGame" orthographic camera={{ zoom: 35, position: [0, 15, 30], far: 100, near: 20 }} onCreated={state => state.camera.lookAt(5, 10, 0)}>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, -10, 10]} intensity={0.75} />
            <PlayArea position={[0, 0, 0]} width={10} height={20}>
                {bricks}
                <Tetromino colour={active.colour} layout={active.baseLayout} position={[...active.position, 0.001]} rotationZ={active.rotation} />
            </PlayArea>
            <PreviewArea position={[11, 15, 0]} current={game.next} />
            <ScoreArea position={[16, 14.5, 1]} score={game.score} />
        </Canvas>
    )
}

export { TetrisGame };