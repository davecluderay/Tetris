import { BrickColour } from "../TetrisPlayArea";
import { Tetromino } from "./Tetromino";

export class YellowTetromino extends Tetromino {
    constructor() {
        super(
            BrickColour.Yellow,
            [
                [1, 1],
                [1, 1]
            ]);
    }
}