import { animated, useSpring } from "@react-spring/three";
import { BrickColour } from "../game/SharedTypes";

type BrickProps = {
    position: [x: number, y: number, z: number],
    rotation?: [x: number, y: number, z: number],
    scale?: number,
    colour: BrickColour
};

function Brick(props: BrickProps) {
    const material = <meshStandardMaterial color={props.colour} />
    const position = adjustPosition(props.position, [1, 1, 1]);
    const [rx, ry, rz] = props.rotation ?? [0, 0, 0];
    const scale = props.scale === undefined ? 1 : props.scale;
    const spring = useSpring({ position: position, rx: rx * Math.PI / 2, ry: ry * Math.PI / 2, rz: rz * Math.PI / 2, scale: scale });
    return (
        <animated.mesh position={spring.position} rotation={[rx, ry, rz]} scale={spring.scale}>
            <boxGeometry args={[1, 1, 1]}/>
            {material}
        </animated.mesh>
    )
}

function adjustPosition(position: [x: number, y: number, z: number], size: [x: number, y: number, z: number]) : [x: number, y: number, z: number] {
    return [
        position[0] + size[0] / 2,
        position[1] + size[1] / 2,
        position[2] + size[2] / 2
    ];
}

export { Brick };