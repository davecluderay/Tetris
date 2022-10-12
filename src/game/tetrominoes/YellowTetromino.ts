import { BrickColour } from "../SharedTypes";
import { Tetromino } from "./Tetromino";

export class YellowTetromino extends Tetromino {
    static layout = [
        [1, 1],
        [1, 1]
    ];
    constructor() {
        super(BrickColour.Yellow, YellowTetromino.layout);
    }
}