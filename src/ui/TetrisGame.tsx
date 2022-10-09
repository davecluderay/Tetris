import './TetrisGame.css';
import { Canvas } from "@react-three/fiber";
import { PlayArea } from './PlayArea';
import { Brick } from './Brick';
import { ReactNode, useMemo } from 'react';
import { CyanTetromino, GreenTetromino, MagentaTetromino, produceRandomTetromino } from '../game/Tetrominoes';
import { Tetromino } from './Tetromino';
import { BrickColour } from '../game/SharedTypes';

type TetrisGameProps = {
    showAxes?: boolean
}

function TetrisGame(props: TetrisGameProps) {
    const bricks = useMemo(() => {
        const results: ReactNode[] = [];
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
            <PlayArea position={[0, 0, -1]} width={10} height={20}>
                {bricks}
                <Tetromino colour={BrickColour.Green} layout={GreenTetromino.layout} position={[4, 10, 0.001]} rotationZ={-0.5} />
            </PlayArea>
        </Canvas>
    )
}

export { TetrisGame };