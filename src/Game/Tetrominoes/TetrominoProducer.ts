import { BlueTetromino } from "./BlueTetromino";
import { CyanTetromino } from "./CyanTetromino";
import { GreenTetromino } from "./GreenTetromino";
import { MagentaTetromino } from "./MagentaTetromino";
import { OrangeTetromino } from "./OrangeTetromino";
import { RedTetromino } from "./RedTetromino";
import { Tetromino } from "./Tetromino";
import { YellowTetromino } from "./YellowTetromino";

export interface TetrominoProducer {
    (): Tetromino
};

const produceRandomTetromino: TetrominoProducer = () => {
    const activators = [
        BlueTetromino,
        CyanTetromino,
        GreenTetromino,
        MagentaTetromino,
        OrangeTetromino,
        RedTetromino,
        YellowTetromino
    ];
    const index = Math.floor(Math.random() * activators.length);
    return new activators[index]();
};

export { produceRandomTetromino };