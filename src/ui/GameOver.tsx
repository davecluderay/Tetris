import { Text } from '@react-three/drei';

type GameOverProps = {
    position: [x: number, y: number, z: number]
};

function GameOver(props: GameOverProps) {
    return (
        <group position={props.position}>
            <Text position={[0, 1.5, 0]} font="Oswald-Bold.ttf" fontSize={1.25} anchorX="center" anchorY="middle" outlineBlur={0.1} outlineColor="#000">
                GAME OVER
                <meshStandardMaterial color="#fff" />
            </Text>
            <Text position={[0, -0.5, 0]} font="Oswald-Bold.ttf" fontSize={1} anchorX="center" anchorY="middle" outlineBlur={0.1} outlineColor="#000">
                Press "S" to Start
                <meshStandardMaterial color="#fff" />
            </Text>
        </group>
    );
}

export { GameOver };

