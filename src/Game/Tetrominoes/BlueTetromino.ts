import { BrickColour } from "../TetrisPlayArea";
import { Tetromino } from "./Tetromino";

export class BlueTetromino extends Tetromino {
    constructor() {
        super(
            BrickColour.Blue,
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ]);
    }
}