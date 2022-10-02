import { Tetromino, TetrominoProducer, produceRandomTetromino } from "./Tetrominoes";
import { BrickColour, TetrominoPosition } from "./Tetrominoes/Tetromino";

const playAreaWidth = 10;
const playAreaHeight = 20;

export class TetrisGame {
    private produceTetromino: TetrominoProducer;
    next: Tetromino;
    active: Tetromino;
    playArea: Array<Array<BrickColour>>;

    constructor(produceTetromino?: TetrominoProducer) {
        this.produceTetromino = produceTetromino ?? produceRandomTetromino;
        this.playArea = Array.from(Array(playAreaHeight), () => Array(playAreaWidth).fill(null));
        this.next = this.produceTetromino();
        this.active = this.produceTetromino();
        this.setInitialPosition(this.active);
    }

    public tick() {
        if (!this.moveActiveTetromino(0, -1)) {
            this.fixActiveTetromino();
        }
    }

    private setInitialPosition(tetromino: Tetromino) {
        tetromino.position = [Math.floor((playAreaWidth - tetromino.layoutSize) / 2) - 1, playAreaHeight + 1];
    }

    private moveActiveTetromino(dx: number, dy: number) : boolean {
        const [x, y] = this.active.position;
        const to: TetrominoPosition = [x + dx, y + dy];
        if (this.canPlace(this.active, [x + dx, y + dy])) {
            this.active.position = to;
            return true;
        }
        return false;
    }

    private fixActiveTetromino() {
        const tetromino = this.active;
        const [atX, atY] = tetromino.position;
        for (let layoutY = 0; layoutY < tetromino.layoutSize; layoutY++) {
            for (let layoutX = 0; layoutX < tetromino.layoutSize; layoutX++) {
                if (tetromino.layout[layoutY][layoutX] !== 1) continue;
                const [x, y] = [atX + layoutX, atY - layoutY];
                if (x < 0 || x >= playAreaWidth) continue;
                if (y < 0 || y >= playAreaHeight) continue;
                this.playArea[y][x] = tetromino.colour;
            }
        }

        this.active = this.next;
        this.setInitialPosition(this.active);
        this.next = this.produceTetromino();
    }

    private canPlace(tetromino: Tetromino, at: TetrominoPosition): boolean {
        const layout = tetromino.layout;
        const [atX, atY] = at;
        for (let layoutY = 0; layoutY < tetromino.layoutSize; layoutY++) {
            for (let x = 0; x < tetromino.layoutSize; x++) {
                if (layout[layoutY][x] !== 1) continue;
                const [testX, testY] = [atX + x, atY - layoutY];
                if (testX < 0 || testX >= playAreaWidth) return false;
                if (testY < 0) return false;
                if (testY >= playAreaHeight) continue;
                if (this.playArea[testY][testX] !== null) return false;
            }
        }
        return true;
    }
}
