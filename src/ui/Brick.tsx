import { BrickColour } from "../game/SharedTypes";

type BrickProps = {
    position: [x: number, y: number, z: number],
    colour: BrickColour
};

function Brick(props: BrickProps) {
    const material = <meshStandardMaterial color={props.colour} />
    const centrePosition = adjustPosition(props.position, [1, 1, 1]);
    return (
        <mesh position={centrePosition}>
            <boxGeometry args={[1, 1, 1]}/>
            {material}
        </mesh>
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