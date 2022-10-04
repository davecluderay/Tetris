import { Tetromino, TetrominoProducer, produceRandomTetromino } from "./Tetrominoes";
import { PlayArea } from "./PlayArea";
import { Position } from "./SharedTypes";

// Outstanding tasks:
// * Remove completed lines and drop remaining lines (with callbacks).
// * Scoring system.
// * Game over state.
// * UI/audio.

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

    public rotateLeft() {
        this.rotateActiveTetromino(-1);
    }

    public rotateRight() {
        this.rotateActiveTetromino(1);
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

    private rotateActiveTetromino(dr: number) {
        const active = this.active;
        const forward = dr < 0 ? () => active.rotateLeft() : () => active.rotateRight();
        const reverse = dr < 0 ? () => active.rotateRight() : () => active.rotateLeft();
        const count = Math.abs(dr);

        for (let n = 0; n < count; n++) { forward(); }

        let [x, y] = this.active.position;
        const kicks = [0, 1, -1, 2, -2, 3, -3];
        for (let kick of kicks) {
            const to: Position = [x + kick, y];
            if (this.canPlace(active, to)) {
                active.position = to;
                return;
            }
        }

        for (let n = 0; n < count; n++) { reverse(); }
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
