import { BrickColour, Position } from "./SharedTypes";

export class PlayArea {
    static readonly width = 10;
    static readonly visibleHeight = 20;

    readonly width = PlayArea.width;
    readonly visibleHeight = PlayArea.visibleHeight;

    private layout: Array<Array<BrickColour | null>>;

    constructor() {
        this.layout = Array.from(Array(this.visibleHeight + 2),
                                 () => Array(this.width).fill(null));
    }

    contains([x, y]: Position) {
        return this.isInBounds(x, y);
    }

    hasBrickAt([x, y]: Position) {
        return this.getBrickAt([x, y]) !== null;
    }

    getBrickAt([x, y]: Position): BrickColour | null {
        return this.isInBounds(x, y) ? this.layout[y][x] : null;
    }

    setBrickAt([x, y]: Position, colour: BrickColour | null) {
        if (!this.isInBounds(x, y)) throw `Out of bounds: ${[x, y]}`
        this.layout[y][x] = colour;
    }

    *getBricks(): Generator<{ brickColour: BrickColour, position: Position }> {
        for (var y = this.visibleHeight - 1; y >= 0; y--) {
            for (var x = 0; x < this.width; x++) {
                const brick = this.getBrickAt([x, y]);
                if (brick !== null) {
                    yield { brickColour: brick, position: [x, y] };
                }
            }
        }
    }

    findCompletedRows(): number[] {
        const rows = [] as number[];
        for (var y = 0; y < this.visibleHeight; y++) {
            let count = 0;
            for (var x = 0; x < this.width; x++) {
                if (!this.hasBrickAt([x, y])) break;
                count++;
            }
            if (count == this.width) {
                rows.push(y);
            }
        }
        return rows;
    }

    removeRows(rows: number[]) {
        if (rows.length < 1) return;
        const startY = rows.reduce((a, v) => Math.min(a, v), Number.MAX_SAFE_INTEGER);
        let dropBy = 0;
        for (var y = startY; y < this.layout.length; y++) {
            if (rows.indexOf(y) > -1) {
                dropBy++;
            } else {
                this.layout[y - dropBy] = this.layout[y];
                this.layout[y] = Array(this.width).fill(null);
            }
        }
    }

    private isInBounds(x: number, y: number) {
        return x >= 0 && x < this.width && y >= 0 && y < this.visibleHeight + 2;
    }
}