import { ReactNode, useMemo } from "react";
import { Tetromino } from "../game/tetrominoes";
import { Brick } from "./Brick";

type PreviewAreaProps = {
    position: [x: number, y: number, z: number],
    current: Tetromino | null
};

let id = 0;

function PreviewArea(props: PreviewAreaProps) {
    const size = 5;
    const current = props.current;
    const tetromino = useMemo<ReactNode[]>(() => {
        if (!current) return [];
        return renderTetromino(current, id++);
    }, [current]);
    const position = adjustPosition(props.position, [size, size, 1]);
    const material = <meshStandardMaterial color="#39241c" />
    return (
        <group position={position}>
            <mesh>
                <boxGeometry args={[size, size, 1]} />
                {material}
            </mesh>
            {tetromino}
        </group>
    );
}

function renderTetromino(tetromino: Tetromino, id: number):  ReactNode[] {
    const {baseLayout: layout, colour} = tetromino;
    let [minX, minY, maxX, maxY] = [Number.MAX_VALUE, Number.MAX_VALUE, 0, 0];
    const bricksAt: [x: number, y: number][] = [];
    for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
            if (layout[y][x] === 1) {
                [minX, maxX] = [Math.min(minX, x), Math.max(maxX, x)];
                [minY, maxY] = [Math.min(minY, layout.length - y), Math.max(maxY, layout.length - y)];
                bricksAt.push([x, layout.length - y]);
            }
        }
    }
    const [width, height] = [maxX - minX + 1, maxY - minY + 1];
    return bricksAt.map(([x, y], i) => <Brick key={`${id}-${i}`} position={[x - minX - width * 0.5, y - minY - height * 0.5, 0.5]} colour={colour} />);
}

// Position provided is the bottom-left corner.
function adjustPosition(position: [x: number, y: number, z: number], size: [x: number, y: number, z: number]) : [x: number, y: number, z: number] {
    return [
        position[0] + size[0] / 2,
        position[1] + size[1] / 2,
        position[2] + size[2] / 2
    ];
}

export { PreviewArea };