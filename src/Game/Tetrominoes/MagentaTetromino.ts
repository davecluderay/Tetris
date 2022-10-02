import { BrickColour, Tetromino } from "./Tetromino";

export class MagentaTetromino extends Tetromino {
    constructor() {
        super(
            BrickColour.Magenta,
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ]);
     }
}