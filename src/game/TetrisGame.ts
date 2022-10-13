import { Tetromino, TetrominoProducer, produceRandomTetromino } from "./tetrominoes";
import { DroppedRow, PlayArea } from "./PlayArea";
import { Position } from "./SharedTypes";
import { ScoreKeeper } from "./ScoreKeeper";

// Outstanding tasks:
// * UI.
// * Audio.

export type TickCallbacks = {
    onBricksLocked: (locked: Position[]) => void,
    onRowsDestroyed: (destroyed: number[], dropped: DroppedRow[]) => void,
    onGameOver: () => void
};

export class TetrisGame {
    private produceTetromino: TetrominoProducer;
    private scoreKeeper: ScoreKeeper; 
    next: Tetromino;
    active: Tetromino;
    playArea: PlayArea;
    isOver: boolean;

    constructor(produceTetromino?: TetrominoProducer) {
        this.produceTetromino = produceTetromino ?? produceRandomTetromino;
        this.scoreKeeper = new ScoreKeeper();
        this.playArea = new PlayArea();
        this.isOver = false;
        this.next = this.produceTetromino();
        this.active = this.produceTetromino();
        this.setInitialPosition(this.active);
    }

    get score() { return this.scoreKeeper.score; }

    public tick(callbacks: TickCallbacks) {
        if (this.isOver) {
            callbacks.onGameOver();
            return;
        }

        this.scoreKeeper.recordTick();

        if (!this.moveActiveTetromino(0, -1)) {
            const locked = this.lockActiveTetromino();
            this.scoreKeeper.recordTetrominoLocked();
            callbacks.onBricksLocked(locked);
            const [min, max] = this.getExtentsY(locked);
            const completed = this.playArea.findCompletedRows(min, max);
            if (completed.length > 0) {
                const dropped = this.playArea.removeRows(completed);
                this.scoreKeeper.recordRowsDestroyed(completed.length);
                callbacks.onRowsDestroyed(completed, dropped);
            }
            if (!this.canPlace(this.active, this.active.position)) {
                this.isOver = true;
                callbacks.onGameOver();
            }
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
        tetromino.position = [Math.floor((this.playArea.width - tetromino.layoutSize) / 2), this.playArea.visibleHeight + 1];
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

    private lockActiveTetromino(): Position[] {
        const locked: Position[] = [];
        const tetromino = this.active;
        const [atX, atY] = tetromino.position;
        for (let layoutY = 0; layoutY < tetromino.layoutSize; layoutY++) {
            for (let layoutX = 0; layoutX < tetromino.layoutSize; layoutX++) {
                if (tetromino.layout[layoutY][layoutX] !== 1) continue;
                const [x, y] = [atX + layoutX, atY - layoutY];
                if (!this.playArea.contains([x, y])) continue;
                this.playArea.setBrickAt([x, y], tetromino.colour);
                locked.push([x, y]);
            }
        }
        this.active = this.next;
        this.setInitialPosition(this.active);
        this.next = this.produceTetromino();
        return locked;
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

    private getExtentsY(locked: Position[]): [min: number, max: number] {
        const values = locked.map(([_, y]) => y);
        return [Math.min(...values), Math.max(...values)];
    }
}
