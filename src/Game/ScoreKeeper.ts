export class ScoreKeeper {
    private lastRowsDestroyed = 0;
    private ticksSinceLastTetrominoLocked = 0;
    score = 0;

    recordTick() {
        this.ticksSinceLastTetrominoLocked++;
    }

    recordTetrominoLocked() {
        this.score += (this.ticksSinceLastTetrominoLocked * 5);
        this.ticksSinceLastTetrominoLocked = 0;
    }

    recordRowsDestroyed(rowsDestroyed: number) {
        switch (rowsDestroyed) {
            case 1:
                this.score += 100;
                break;
            case 2:
                this.score += 200;
                break;
            case 3:
                this.score += 400;
                break;
            case 4:
                this.score += this.lastRowsDestroyed == 4 ? 1200 : 800;
                break;
        }
        this.lastRowsDestroyed = rowsDestroyed;
    }
}