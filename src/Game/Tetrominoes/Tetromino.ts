
export enum BrickColour {
    Blue = "#3366cc",
    Green = "#33cc33",
    Red = "#cc3333",
    Yellow = "#ffe000",
    Orange = "#ff9900",
    Magenta = "#ff3399",
    Cyan = "#33ccff"
}

export type Position = [x: number, y: number];

export abstract class Tetromino {
    position: [x: number, y: number];
    rotation: number;
    colour: BrickColour;
    layout: number[][];
    layoutSize: number;

    protected constructor(colour: BrickColour, layout: number[][], rotation: number = 0, position: Position = [0, 0]) {
        this.position = position;
        this.rotation = rotation;
        this.colour = colour;
        this.layout = layout;
        this.layoutSize = layout.length;
    }

    public moveLeft() {
        var [x, y] = this.position;
        this.position = [x - 1, y];
    }

    public moveRight() {
        var [x, y] = this.position;
        this.position = [x + 1, y];
    }

    public rotateLeft() {
        this.layout = this.getLeftRotatedLayout();
        this.rotation--;
    }

    public rotateRight() {
        this.layout = this.getRightRotatedLayout();
        this.rotation++;
    }

    private getLeftRotatedLayout() : number[][] {
        const size = this.layout.length;
        const result : number[][] = [];
        for (let x = 0; x < size; x++) {
            result[size - x - 1] = [];
            for (let y = 0; y < size; y++) {
                result[size - x - 1][y] = this.layout[y][x];
            }
        }
        return result;
    }

    private getRightRotatedLayout() : number[][] {
        const size = this.layout.length;
        const result : number[][] = [];
        for (let x = 0; x < size; x++) {
            result[x] = [];
            for (let y = 0; y < size; y++) {
                result[x][size - y - 1] = this.layout[y][x];
            }
        }
        return result;
    }
}