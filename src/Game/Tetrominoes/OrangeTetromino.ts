import { BrickColour } from "../TetrisPlayArea";
import { Tetromino } from "./Tetromino";

export class OrangeTetromino extends Tetromino {
    constructor() { 
        super(
            BrickColour.Orange,
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ]);
     }
}