import { BrickColour } from "../SharedTypes";
import { Tetromino } from "./Tetromino";

export class CyanTetromino extends Tetromino {
    static layout = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    constructor() {
        super(
            BrickColour.Cyan, CyanTetromino.layout);
     }
};