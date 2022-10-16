import { Text } from '@react-three/drei';

type ControlsHelpProps = {
    position: [x: number, y: number, z: number]
};

function ControlsHelp(props: ControlsHelpProps) {
    return (
        <Text position={props.position} font="Oswald-Bold.ttf" fontSize={0.75} letterSpacing={-0.02} textAlign="right" anchorX="right" anchorY="top">
            {[
                "Move Left : Left",
                "Move Right : Right",
                "Move Down : Down",
                "Rotate Left : Z",
                "Rotate Right : X"
            ].join('\n')}
            <meshStandardMaterial color="#fff" opacity={0.25} />
        </Text>
    );
}

export { ControlsHelp };
