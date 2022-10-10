import { BrickColour } from "../SharedTypes";
import { Tetromino } from "./Tetromino";

export class RedTetromino extends Tetromino {
    static layout = [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ];
    constructor() {
        super(BrickColour.Red, RedTetromino.layout);
     }
};