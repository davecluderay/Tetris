import { BrickColour } from "../game/SharedTypes";
import { animated, useSpring } from "@react-spring/three"
import { useMemo } from "react";

type TetrominoProps = {
  position: [x: number, y: number, z: number],
  rotationZ: number,
  colour: BrickColour,
  layout: number[][]
};

function Tetromino(props: TetrominoProps) {
  const spring = useSpring({ position: props.position, rotationZ: props.rotationZ * Math.PI / 2 })
  const material = <meshStandardMaterial color={props.colour} />
  const layout = props.layout;

  const brickPositions = useMemo<[x: number, y: number, z: number][]>(() => {
    const results: [x: number, y: number, z: number][] = [];
    for (let y = 0; y < layout.length; y++) {
      for (let x = 0; x < layout[y].length; x++) {
        if (layout[y][x] === 1) {
          results.push([x, layout.length - y - 1, 0]);
        }
      }
    }
    return results
  }, [ layout ]);

  return (
    <animated.group position={spring.position} rotation-z={spring.rotationZ}>
      {brickPositions.map((p, i) => <mesh key={i} position={p}>
        <boxGeometry args={[1, 1, 1]} />
        {material}
      </mesh>)}
    </animated.group>
  )
}

export { Tetromino }
