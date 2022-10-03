import { BrickColour } from "../SharedTypes";
import { Tetromino } from "./Tetromino";

export class GreenTetromino extends Tetromino {
    constructor() { 
        super(
            BrickColour.Green,
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ]);
    }
};