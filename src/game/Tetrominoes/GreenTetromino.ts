import { BrickColour } from "../SharedTypes";
import { Tetromino } from "./Tetromino";

export class GreenTetromino extends Tetromino {
    static layout = [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ];
    constructor() { 
        super(BrickColour.Green, GreenTetromino.layout);
    }
};