import './TetrisGame.css';
import { Canvas } from "@react-three/fiber";

type TetrisGameProps = {
}

function TetrisGame(props: TetrisGameProps) {
    return (
        <Canvas className="TetrisGame" orthographic camera={{ zoom: 30, position: [5, 20, 30], far: 100, near: 20 }} onCreated={state => state.camera.lookAt(5, 10, 0)}>
        </Canvas>
    )
}

export { TetrisGame };