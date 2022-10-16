import { BrickColour, Position } from "./SharedTypes";

export type DroppedRow = {
    row: number,
    distance: number
};

export type Brick = {
    id: number,
    position: [x: number, y:number],
    colour: BrickColour
};

export type RowOfBricks = {
    y: number,
    bricks: Brick[]
};

let nextId = 1;

export class PlayArea {
    static readonly width = 10;
    static readonly visibleHeight = 20;

    readonly width = PlayArea.width;
    readonly visibleHeight = PlayArea.visibleHeight;

    private layout: Array<Array<Brick | null>>;

    constructor() {
        this.layout = Array.from(Array(this.visibleHeight + 2),
                                 () => Array(this.width).fill(null));
    }

    reset() {
        this.layout.forEach(row => row.fill(null));
    }

    contains([x, y]: Position) {
        return this.isInBounds(x, y);
    }

    hasBrickAt([x, y]: Position): boolean {
        return this.getBrickAt([x, y]) !== null;
    }

    getBrickAt([x, y]: Position): Brick | null {
        return this.isInBounds(x, y) ? this.layout[y][x] : null;
    }

    setBrickAt([x, y]: Position, colour: BrickColour | null) {
        if (!this.isInBounds(x, y)) throw new Error(`Out of bounds: ${[x, y]}`);
        this.layout[y][x] = colour ? { id: nextId++, position: [x, y], colour: colour } : null;
    }

    *getBricks(fromY?: number, toY?: number): Generator<Brick> {
        const maxY = toY === undefined ? this.visibleHeight - 1 : toY;
        const minY = fromY === undefined ? 0 : fromY;
        for (var y = maxY; y >= minY; y--) {
            for (var x = 0; x < this.width; x++) {
                const brick = this.getBrickAt([x, y]);
                if (brick !== null) {
                    yield brick;
                }
            }
        }
    }

    findCompletedRows(min: number, max: number): RowOfBricks[] {
        const rows = [] as RowOfBricks[];
        for (var y = min; y <= max; y++) {
            const bricks = [...this.getBricks(y, y)];
            if (bricks.length === this.width) {
                rows.push({ y, bricks });
            }
        }
        return rows;
    }

    removeRows(rows: number[]): DroppedRow[] {
        if (rows.length < 1) return [];
        const startY = rows.reduce((a, v) => Math.min(a, v), Number.MAX_SAFE_INTEGER);
        const dropped: DroppedRow[] = [];
        let dropBy = 0;
        for (var y = startY; y < this.layout.length; y++) {
            if (rows.indexOf(y) > -1) {
                dropBy++;
            } else {
                const newY = y - dropBy;
                this.layout[newY] = this.layout[y];
                this.layout[newY].forEach(x => { if (x) { x.position[1] = newY; } });
                this.layout[y] = Array(this.width).fill(null);
                dropped.push({ row: y, distance: dropBy });
            }
        }
        return dropped;
    }

    private isInBounds(x: number, y: number) {
        return x >= 0 && x < this.width && y >= 0 && y < this.visibleHeight + 2;
    }
}