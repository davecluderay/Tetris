import { BrickColour } from "../SharedTypes";
import { Tetromino } from "./Tetromino";

export class OrangeTetromino extends Tetromino {
    static layout = [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ];
    constructor() { 
        super(BrickColour.Orange, OrangeTetromino.layout);
     }
};