export class ScoreKeeper {
    private lastRowsDestroyed = 0;
    private ticksSinceLastTetrominoLocked = 0;
    score = 0;

    reset() {
        this.score = this.lastRowsDestroyed = this.ticksSinceLastTetrominoLocked = 0;
    }

    recordTick() {
        this.ticksSinceLastTetrominoLocked++;
    }

    recordTetrominoLocked() {
        const bonus = Math.floor(Math.max(0, 20 - this.ticksSinceLastTetrominoLocked) / 4);
        this.score += (this.ticksSinceLastTetrominoLocked * bonus);
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
                this.score += this.lastRowsDestroyed === 4 ? 1200 : 800;
                break;
        }
        this.lastRowsDestroyed = rowsDestroyed;
    }
}