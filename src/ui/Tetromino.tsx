import { BrickColour } from "../game/SharedTypes";
import { animated, useSpring } from "@react-spring/three"
import { useMemo } from "react";
import { Brick } from "./Brick";

type TetrominoProps = {
  position: [x: number, y: number, z: number],
  rotationZ: number,
  colour: BrickColour,
  layout: number[][]
};

function Tetromino(props: TetrominoProps) {
  const layout = props.layout;
  const size = layout.length;
  const adjustedPosition = adjustPosition(props.position, [size / 2, 1 - size / 2, 0]);
  const spring = useSpring({ position: adjustedPosition, rotationZ: props.rotationZ * Math.PI / 2 })

  const brickPositions = useMemo<[x: number, y: number, z: number][]>(() => {
    const results: [x: number, y: number, z: number][] = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (layout[y][x] === 1) {
          results.push([x - size / 2, size / 2 - y - 1, 0]);
        }
      }
    }
    return results
  }, [layout, size]);

  return (
    <animated.group position={spring.position} rotation-z={spring.rotationZ}>
      {brickPositions.map((p, i) => <Brick key={i} position={p} colour={props.colour} />)}
    </animated.group>
  )
}

// Position provided is the bottom-left corner.
function adjustPosition(position: [x: number, y: number, z: number], size: [x: number, y: number, z: number]) : [x: number, y: number, z: number] {
    return [
        position[0] + size[0],
        position[1] + size[1],
        position[2] + size[2]
    ];
}

export { Tetromino }
