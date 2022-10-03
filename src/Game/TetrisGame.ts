import { Tetromino, TetrominoProducer, produceRandomTetromino } from "./Tetrominoes";
import { PlayArea } from "./PlayArea";
import { Position } from "./SharedTypes";

export class TetrisGame {
    private produceTetromino: TetrominoProducer;
    next: Tetromino;
    active: Tetromino;
    playArea: PlayArea;

    constructor(produceTetromino?: TetrominoProducer) {
        this.produceTetromino = produceTetromino ?? produceRandomTetromino;
        this.playArea = new PlayArea();
        this.next = this.produceTetromino();
        this.active = this.produceTetromino();
        this.setInitialPosition(this.active);
    }

    public tick() {
        if (!this.moveActiveTetromino(0, -1)) {
            this.lockActiveTetromino();
        }
    }

    public left() {
        this.moveActiveTetromino(-1, 0);
    }

    public right() {
        this.moveActiveTetromino(1, 0);
    }

    public down() {
        this.moveActiveTetromino(0, -1);
    }

    private setInitialPosition(tetromino: Tetromino) {
        tetromino.position = [Math.floor((this.playArea.width - tetromino.layoutSize) / 2) - 1, this.playArea.visibleHeight + 1];
    }

    private moveActiveTetromino(dx: number, dy: number) : boolean {
        const [x, y] = this.active.position;
        const to: Position = [x + dx, y + dy];
        if (this.canPlace(this.active, [x + dx, y + dy])) {
            this.active.position = to;
            return true;
        }
        return false;
    }

    private lockActiveTetromino() {
        const tetromino = this.active;
        const [atX, atY] = tetromino.position;
        for (let layoutY = 0; layoutY < tetromino.layoutSize; layoutY++) {
            for (let layoutX = 0; layoutX < tetromino.layoutSize; layoutX++) {
                if (tetromino.layout[layoutY][layoutX] !== 1) continue;
                const [x, y] = [atX + layoutX, atY - layoutY];
                if (!this.playArea.contains([x, y])) continue;
                this.playArea.setBrickAt([x, y], tetromino.colour);
            }
        }

        this.active = this.next;
        this.setInitialPosition(this.active);
        this.next = this.produceTetromino();
    }

    private canPlace(tetromino: Tetromino, at: Position): boolean {
        const layout = tetromino.layout;
        const [atX, atY] = at;
        for (let layoutY = 0; layoutY < tetromino.layoutSize; layoutY++) {
            for (let x = 0; x < tetromino.layoutSize; x++) {
                if (layout[layoutY][x] !== 1) continue;
                const [testX, testY] = [atX + x, atY - layoutY];
                if (!this.playArea.contains([testX, testY])) return false;
                if (this.playArea.hasBrickAt([testX, testY])) return false;
            }
        }
        return true;
    }
}
