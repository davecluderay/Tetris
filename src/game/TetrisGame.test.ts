import { TetrisGame } from "./TetrisGame";
import { BlueTetromino, CyanTetromino, GreenTetromino, MagentaTetromino, OrangeTetromino, RedTetromino, Tetromino, TetrominoProducer, YellowTetromino } from "./tetrominoes";
import { BrickColour, Position } from "./SharedTypes";
import { DroppedRow, PlayArea, RowOfBricks } from "./PlayArea";

const areaWidth = PlayArea.width;
const areaVisibleHeight = PlayArea.visibleHeight;
const areaMidHeight = Math.floor(areaVisibleHeight / 2);

type MovementOperation = "left" | "right" | "down";
type RotationOperation = "rotateLeft" | "rotateRight";

let tickCallbacks: {
    onBricksLocked: jest.Mock<void,[locked: Position[]]>,
    onRowsDestroyed: jest.Mock<void, [destroyed: RowOfBricks[], dropped: DroppedRow[]]>,
    onGameOver: jest.Mock<void, []>
};

beforeEach(() => {
    tickCallbacks = {
        onBricksLocked: jest.fn((_locked: Position[]) => {}),
        onRowsDestroyed: jest.fn((_destroyed: RowOfBricks[], _dropped: DroppedRow[]) => {}),
        onGameOver: jest.fn(() => {})
    };
});

test('can create game', () => {
    const game = new TetrisGame();
    expect(game).toBeInstanceOf(TetrisGame);
});

test('newly created game is not active', () => {
    const game = new TetrisGame();
    expect(game.isOver).toBe(true);
});

test('newly created game has play area defined', () => {
    const game = new TetrisGame();
    expect(game.playArea).toBeDefined();
    expect(game.playArea.visibleHeight).toBe(areaVisibleHeight);
    expect(game.playArea.width).toBe(areaWidth);
});

test('started game has active block', () => {
    const game = new TetrisGame();
    game.start();
    expect(game.active).toBeInstanceOf(Tetromino);
});

test('started game has next block', () => {
    const game = new TetrisGame();
    game.start();
    expect(game.next).toBeInstanceOf(Tetromino);
});

type InitialPositionTestCase = { producer: TetrominoProducer, expectedPosition: Position };
test.each([
    { producer: () => new BlueTetromino(), expectedPosition: [areaWidth / 2 - 2, areaVisibleHeight + 1] },
    { producer: () => new CyanTetromino(), expectedPosition: [areaWidth / 2 - 2, areaVisibleHeight + 1] },
    { producer: () => new GreenTetromino(), expectedPosition: [areaWidth / 2 - 2, areaVisibleHeight + 1] },
    { producer: () => new MagentaTetromino(), expectedPosition: [areaWidth / 2 - 2, areaVisibleHeight + 1] },
    { producer: () => new OrangeTetromino(), expectedPosition: [areaWidth / 2 - 2, areaVisibleHeight + 1] },
    { producer: () => new RedTetromino(), expectedPosition: [areaWidth / 2 - 2, areaVisibleHeight + 1] },
    { producer: () => new YellowTetromino(), expectedPosition: [areaWidth / 2 - 1, areaVisibleHeight + 1] }
] as InitialPositionTestCase[])('initial tetromino position is central', ({ producer, expectedPosition }: InitialPositionTestCase) => {
    const game = new TetrisGame(producer);
    game.start();
    expect(game.active.position).toEqual(expectedPosition);
});

test('active tetromino descends when not obstructed', () => {
    const game = new TetrisGame();
    game.start();
    let [x, y] = game.active.position;
    game.tick(tickCallbacks);
    expect(game.active.position).toEqual([x, y - 1]);
});

test('active tetromino becomes locked at base of play area', () => {
    const game = new TetrisGame(() => new CyanTetromino());
    game.start();
    let tetromino = game.active;
    let [x, _] = tetromino.position;
    tetromino.position = [x, 1];
    game.tick(tickCallbacks);
    expect(game.active).not.toEqual(tetromino);
    expect(tickCallbacks.onBricksLocked.mock.calls).toHaveLength(1);
    expect(tickCallbacks.onBricksLocked.mock.calls[0][0]).toEqual(expect.arrayContaining([[x, 0], [x + 1, 0], [x + 2, 0], [x + 3, 0]]))
});

type ObstructedFromBelowTestCase = { producer: TetrominoProducer, tetrominoAt: Position, obstructedAt: Position };
test.each([
    { producer: () => new GreenTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [2, areaMidHeight - 2] },
    { producer: () => new GreenTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [4, areaMidHeight - 1] },
    { producer: () => new RedTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [2, areaMidHeight - 1] },
    { producer: () => new RedTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [4, areaMidHeight - 2] },
] as ObstructedFromBelowTestCase[])('active tetromino becomes locked when obstructed from below', ({ producer, tetrominoAt, obstructedAt }) => {
    const game = new TetrisGame(producer);
    game.start();
    const tetromino = game.active;
    tetromino.position = tetrominoAt;
    game.playArea.setBrickAt(obstructedAt, BrickColour.Blue);
    game.tick(tickCallbacks);
    expect(game.active).not.toEqual(tetromino);
});

type UnobstructedMovementTestCase = { producer: TetrominoProducer, tetrominoAt: Position, operation: MovementOperation, expectedPosition: Position };
test.each([
    { producer: () => new OrangeTetromino(), tetrominoAt: [2, areaMidHeight], operation: "left", expectedPosition: [1, areaMidHeight] },
    { producer: () => new OrangeTetromino(), tetrominoAt: [2, areaMidHeight], operation: "right", expectedPosition: [3, areaMidHeight] },
    { producer: () => new OrangeTetromino(), tetrominoAt: [2, areaMidHeight], operation: "down", expectedPosition: [2, areaMidHeight - 1] }
] as UnobstructedMovementTestCase[])('active tetromino can move when not obstructed', ({ producer, tetrominoAt, operation, expectedPosition }) => {
    const game = new TetrisGame(producer);
    game.start();
    game.active.position = tetrominoAt;
    game[operation]();
    expect(game.active.position).toEqual(expectedPosition);
});

type ObstructedMovementTestCase = { producer: TetrominoProducer, tetrominoAt: Position, obstructedAt?: Position, operation: MovementOperation };
test.each([
    { producer: () => new GreenTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [1, areaMidHeight - 1], operation: "left" },
    { producer: () => new GreenTetromino(), tetrominoAt: [0, areaMidHeight], obstructedAt: undefined, operation: "left" },
    { producer: () => new GreenTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [5, areaMidHeight], operation: "right" },
    { producer: () => new GreenTetromino(), tetrominoAt: [PlayArea.width - 3, areaMidHeight], obstructedAt: undefined, operation: "right" },
    { producer: () => new GreenTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [2, areaMidHeight - 2], operation: "down" },
    { producer: () => new GreenTetromino(), tetrominoAt: [2, 1], obstructedAt: undefined, operation: "down" }
] as ObstructedMovementTestCase[])('active tetromino can not move when obstructed', ({ producer, tetrominoAt, obstructedAt, operation }) => {
    const game = new TetrisGame(producer);
    game.start();
    const tetromino = game.active;
    tetromino.position = tetrominoAt;
    if (obstructedAt) {
        game.playArea.setBrickAt(obstructedAt, BrickColour.Blue);
    }
    game[operation]();
    expect(game.active.position).toEqual(tetrominoAt);
});

type UnobstructedRotationTestCase = { tetrominoAt: Position, operation: RotationOperation, times: number, expectedRotation: number };
test.each([
    { tetrominoAt: [2, areaMidHeight], operation: "rotateLeft", times: 0, expectedRotation: 0 },
    { tetrominoAt: [2, areaMidHeight], operation: "rotateLeft", times: 1, expectedRotation: -1 },
    { tetrominoAt: [2, areaMidHeight], operation: "rotateLeft", times: 2, expectedRotation: -2 },
    { tetrominoAt: [2, areaMidHeight], operation: "rotateLeft", times: 3, expectedRotation: -3 },
    { tetrominoAt: [2, areaMidHeight], operation: "rotateLeft", times: 4, expectedRotation: -4 },
    { tetrominoAt: [2, areaMidHeight], operation: "rotateRight", times: 1, expectedRotation: 1 },
    { tetrominoAt: [2, areaMidHeight], operation: "rotateRight", times: 2, expectedRotation: 2 },
    { tetrominoAt: [2, areaMidHeight], operation: "rotateRight", times: 3, expectedRotation: 3 },
    { tetrominoAt: [2, areaMidHeight], operation: "rotateRight", times: 4, expectedRotation: 4 }
] as UnobstructedRotationTestCase[])('active tetromino can rotate when not obstructed', ({ tetrominoAt, operation, times, expectedRotation }) => {
    const game = new TetrisGame();
    game.start();
    game.active.position = tetrominoAt;
    for (let n = 0; n < times; n++) {
        game[operation]();
    }
    expect(game.active.position).toEqual(tetrominoAt);
    expect(game.active.rotation).toBe(expectedRotation);
});

type LateralKickTestCase = { producer: TetrominoProducer, tetrominoAt: Position, startRotation: number, operation: RotationOperation, obstructedAt: Position[], expectedPosition: Position };
test.each([
    { producer: () => new CyanTetromino(), tetrominoAt: [PlayArea.width - 3, areaMidHeight], startRotation: 1, operation: "rotateRight", obstructedAt: [], expectedPosition: [PlayArea.width - 4, areaMidHeight] },
    { producer: () => new CyanTetromino(), tetrominoAt: [-2, areaMidHeight], startRotation: 1, operation: "rotateRight", obstructedAt: [], expectedPosition: [0, areaMidHeight] },
    { producer: () => new CyanTetromino(), tetrominoAt: [0, areaMidHeight], startRotation: 1, operation: "rotateRight", obstructedAt: [[0, areaMidHeight - 2]], expectedPosition: [1, areaMidHeight] },
    { producer: () => new BlueTetromino(), tetrominoAt: [0, areaMidHeight], startRotation: 0, operation: "rotateRight", obstructedAt: [[1, areaMidHeight]], expectedPosition: [1, areaMidHeight] },
    { producer: () => new GreenTetromino(), tetrominoAt: [0, areaMidHeight], startRotation: 0, operation: "rotateRight", obstructedAt: [[1, areaMidHeight]], expectedPosition: [1, areaMidHeight] }
] as LateralKickTestCase[])('active tetromino can rotate with lateral kicks from obstacles', ({ producer, tetrominoAt, startRotation, operation, obstructedAt, expectedPosition }) => {
    const game = new TetrisGame(producer);
    game.start();
    game.active.position = tetrominoAt;
    for (let n = 0; n < startRotation; n++) {
        game.active.rotateRight();
    }
    for (let pos of obstructedAt) {
        game.playArea.setBrickAt(pos, BrickColour.Red);
    }
    game[operation]();
    expect(game.active.position).toEqual(expectedPosition);
    expect(game.active.rotation).not.toBe(startRotation);
});

type BlockedRotationTestCase = { producer: TetrominoProducer, tetrominoAt: Position, startRotation: number, operation: RotationOperation, obstructedAt: Position[] };
test.each([
    { producer: () => new CyanTetromino(), tetrominoAt: [2, 1], startRotation: 0, operation: "rotateRight", obstructedAt: [] },
    { producer: () => new CyanTetromino(), tetrominoAt: [0, areaMidHeight], startRotation: 1, operation: "rotateRight", obstructedAt: [[3, areaMidHeight - 2]] },
    { producer: () => new OrangeTetromino(), tetrominoAt: [0, areaMidHeight], startRotation: 1, operation: "rotateRight", obstructedAt: [[2, areaMidHeight - 1], [4, areaMidHeight - 1]] },
    { producer: () => new RedTetromino(), tetrominoAt: [2, areaMidHeight], startRotation: 1, operation: "rotateLeft", obstructedAt: [[1, areaMidHeight], [3, areaMidHeight], [6, areaMidHeight - 1]] }
] as BlockedRotationTestCase[])('active tetromino can not rotate when completely obstructed', ({ producer, tetrominoAt, startRotation, obstructedAt, operation }) => {
    const game = new TetrisGame(producer);
    game.start();
    game.active.position = tetrominoAt;
    for (let n = 0; n < startRotation; n++) {
        game.active.rotateRight();
    }
    for (let pos of obstructedAt) {
        game.playArea.setBrickAt(pos, BrickColour.Red);
    }
    game[operation]();
    expect(game.active.position).toEqual(tetrominoAt);
    expect(game.active.rotation).toBe(startRotation);
});

type RowsDestroyedTestCase = { provider: TetrominoProducer, startRotation: number, startPosition: Position, expectedDestroyed: number[], expectedDropped: DroppedRow[] };
test.each([
    {
        provider: () => new CyanTetromino(), startRotation: 1, startPosition: [2, 4], expectedDestroyed: [1, 2, 3, 4],
        expectedDropped: range(5, PlayArea.visibleHeight + 1).map(n => ({ row: n, distance: 4 } as DroppedRow))
    },
    {
        provider: () => new MagentaTetromino(), startRotation: 2, startPosition: [3, 6], expectedDestroyed: [4],
        expectedDropped: range(5, PlayArea.visibleHeight + 1).map(n => ({ row: n, distance: 1 } as DroppedRow))
    },
    {
        provider: () => new BlueTetromino(), startRotation: 1, startPosition: [3, 5], expectedDestroyed: [3, 4],
        expectedDropped: range(5, PlayArea.visibleHeight + 1).map(n => ({ row: n, distance: 2 } as DroppedRow))
    }
] as RowsDestroyedTestCase[])('completed rows are destroyed', ({ provider, startRotation, startPosition, expectedDestroyed, expectedDropped }) => {
    const game = new TetrisGame(provider);
    game.start();
    for (let n = 0; n < startRotation; n++) {
        game.active.rotateRight();
    }
    game.active.position = startPosition;
    setupPlayArea(game, [
        '#### #####',
        '#### #####',
        '#### #####',
        '#### #####',
        '##########'
    ]);
    game.tick(tickCallbacks);
    expect(tickCallbacks.onRowsDestroyed.mock.calls).toHaveLength(1);
    expect(tickCallbacks.onRowsDestroyed.mock.lastCall![0].map(d => d.y)).toEqual(expectedDestroyed);
    expect(tickCallbacks.onRowsDestroyed.mock.lastCall![1]).toEqual(expectedDropped);
});

test('rows drop correctly when destroyed rows are separated', () => {
    const game = new TetrisGame(() => new CyanTetromino());
    game.start();
    const expectedDropped: DroppedRow[] = [{ row: 3, distance: 1 }, ...range(5, game.playArea.visibleHeight + 1).map(n => ({ row: n, distance: 2 }))];
    game.active.rotateRight();
    game.active.position = [2, 4];
    setupPlayArea(game, [
        '#### #####',
        '#  # #   #',
        '#### #####',
        '#  # #   #',
        '##########'
    ]);
    game.tick(tickCallbacks);
    expect(tickCallbacks.onRowsDestroyed.mock.calls).toHaveLength(1);
    expect(tickCallbacks.onRowsDestroyed.mock.lastCall![0].map(d => d.y)).toEqual([2, 4]);
    expect(tickCallbacks.onRowsDestroyed.mock.lastCall![1]).toEqual(expectedDropped);
})

test('game over', () => {
    const game = new TetrisGame(() => new YellowTetromino());
    game.start();
    game.playArea.setBrickAt([4, game.playArea.visibleHeight - 1], BrickColour.Red);
    game.tick(tickCallbacks);
    expect(tickCallbacks.onGameOver.mock.calls).toHaveLength(1);
    expect(game.isOver).toBe(true);
});

function setupPlayArea(game: TetrisGame, baseLayout: string[]) {
    for (var y = 0; y < baseLayout.length; y++) {
        for (var x = 0; x < game.playArea.width; x++) {
            if (baseLayout[baseLayout.length - y - 1][x] != ' ') {
                game.playArea.setBrickAt([x, y], BrickColour.Red);
            }
        }
    }
}

function range(from: number, to: number): number[] {
    const range = [];
    const dn = Math.sign(to - from);
    for (let n = from; n != to + dn; n += dn) {
        range.push(n);
    }
    return range;
}