import { Text } from '@react-three/drei';

type ScoreAreaProps = {
    position: [x: number, y: number, z: number],
    score: number
};

function ScoreArea(props: ScoreAreaProps) {
    return (
        <Text position={props.position} font="Oswald-Bold.ttf" fontSize={1.25} letterSpacing={-0.02} anchorX="right" anchorY="top">
            {props.score}
            <meshStandardMaterial color="#fff" opacity={0.25} />
        </Text>
    );
}

export { ScoreArea };

