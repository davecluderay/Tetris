import { PropsWithChildren } from "react"

type PlayAreaProps = PropsWithChildren<{
    position: [x: number, y: number, z: number],
    width: number,
    height: number
}>;

function PlayArea(props: PlayAreaProps) {
    const material = <meshStandardMaterial color="#39241c" />
    const centrePosition = adjustPosition(props.position, [props.width, props.height, 1]);

    return (
        <group position={centrePosition}>
            <mesh>
                <boxGeometry args={[props.width, props.height, 1]} />
                {material}
            </mesh>
            <mesh position={[0, (props.height + 0.5) * -0.5, 0.5]}>
                <boxGeometry args={[props.width, 0.5, 2]} />
                {material}
            </mesh>
            <group position={[props.width * -0.5, props.height * -0.5, 0.5]}>
                {props.children}
            </group>
        </group>
    )
}

// Position provided is the bottom-left corner.
function adjustPosition(position: [x: number, y: number, z: number], size: [x: number, y: number, z: number]) : [x: number, y: number, z: number] {
    return [
        position[0] + size[0] / 2,
        position[1] + size[1] / 2,
        position[2] + size[2] / 2
    ];
}

export { PlayArea };