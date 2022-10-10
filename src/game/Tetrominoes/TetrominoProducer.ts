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

const activators = [
    () => new BlueTetromino() as Tetromino,
    () => new CyanTetromino() as Tetromino,
    () => new MagentaTetromino() as Tetromino,
    () => new OrangeTetromino() as Tetromino,
    () => new YellowTetromino() as Tetromino,
    () => new GreenTetromino() as Tetromino,
    () => new RedTetromino() as Tetromino
];

let unsafeRunLength = 0;
const produceRandomTetromino: TetrominoProducer = () => {
    let exclusiveUpperBound = (unsafeRunLength < 4) ? 7 : 5;
    const activatorIndex = Math.floor(Math.random() * exclusiveUpperBound);
    const tetromino =  activators[activatorIndex]();
    unsafeRunLength = (tetromino instanceof RedTetromino || tetromino instanceof GreenTetromino) ? (unsafeRunLength + 1) : 0;
    return tetromino;
};

export { produceRandomTetromino };