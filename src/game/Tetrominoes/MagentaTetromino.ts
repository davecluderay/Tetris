import { BrickColour } from "../SharedTypes";
import { Tetromino } from "./Tetromino";

export class MagentaTetromino extends Tetromino {
    static layout = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ];
    constructor() {
        super(BrickColour.Magenta, MagentaTetromino.layout);
     }
};