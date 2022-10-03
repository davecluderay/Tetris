import { BrickColour } from "../TetrisPlayArea";
import { Tetromino } from "./Tetromino";

export class CyanTetromino extends Tetromino {
    constructor() {
        super(
            BrickColour.Cyan,
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]);
     }
}