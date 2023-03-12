import { Text } from '@react-three/drei';

type GameOverProps = {
    beforeFirstGame: boolean,
    position: [x: number, y: number, z: number]
};

type PositionedTextProps = {
    position: [x: number, y: number, z: number],
    fontSize: number,
    text: string,
    visible: boolean
};

function PositionedText(props: PositionedTextProps) {
    if (!props.visible) return null;
    return (
        <Text position={props.position} font="Oswald-Bold.ttf" fontSize={props.fontSize} anchorX="center" anchorY="middle" outlineBlur={0.1} outlineColor="#000">
            {props.text}
            <meshStandardMaterial color="#fff" />
        </Text>
    );
}

function GameOver(props: GameOverProps) {
    return (
        <group position={props.position}>
            {!props.beforeFirstGame && <PositionedText position={[0, 1.5, 0]} fontSize={1.25} text={"GAME OVER"} visible={!props.beforeFirstGame} />}
            <PositionedText position={[0, props.beforeFirstGame ? 0.5 : -0.5, 0]} fontSize={1} text={'Press "S" to Start'} visible={true} />
        </group>
    );
}

export { GameOver };