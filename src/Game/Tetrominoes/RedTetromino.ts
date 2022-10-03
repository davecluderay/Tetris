import { BrickColour } from "../SharedTypes";
import { Tetromino } from "./Tetromino";

export class RedTetromino extends Tetromino {
    constructor() {
        super(
            BrickColour.Red,
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ]);
     }
};