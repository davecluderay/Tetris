import { TetrisGame } from "./TetrisGame";
import { BlueTetromino, CyanTetromino, GreenTetromino, MagentaTetromino, OrangeTetromino, RedTetromino, Tetromino, Position, TetrominoProducer, YellowTetromino } from "./Tetrominoes";
import { BrickColour } from "./TetrisPlayArea";

type MovementOperation = "left" | "right" | "down";
type InitialPositionTestCase = { producer: TetrominoProducer, expectedPosition: Position };
type ObstructedFromBelowTestCase = { producer: TetrominoProducer, tetrominoAt: Position, obstructedAt: Position };
type ObstructedMovementTestCase = { producer: TetrominoProducer, tetrominoAt: Position, obstructedAt?: Position, operation: MovementOperation };
type UnobstructedMovementTestCase = { producer: TetrominoProducer, tetrominoAt: Position, operation: MovementOperation, expectedPosition: Position };

test('can create game', () => {
    const game = new TetrisGame();
    expect(game).toBeInstanceOf(TetrisGame);
});

test('new game has active block', () => {
    const game = new TetrisGame();
    expect(game.next).toBeInstanceOf(Tetromino);
});

test('new game has next block', () => {
    const game = new TetrisGame();
    expect(game.next).toBeInstanceOf(Tetromino);
});

test('new game has play area defined', () => {
    const game = new TetrisGame();
    expect(game.playArea).toBeDefined();
    expect(game.playArea.visibleHeight).toBe(20);
    expect(game.playArea.width).toBe(10);
});

test.each([
    { producer: () => new BlueTetromino(), expectedPosition: [2, 21] },
    { producer: () => new CyanTetromino(), expectedPosition: [2, 21] },
    { producer: () => new GreenTetromino(), expectedPosition: [2, 21] },
    { producer: () => new MagentaTetromino(), expectedPosition: [2, 21] },
    { producer: () => new OrangeTetromino(), expectedPosition: [2, 21] },
    { producer: () => new RedTetromino(), expectedPosition: [2, 21] },
    { producer: () => new YellowTetromino(), expectedPosition: [3, 21] }
] as InitialPositionTestCase[])('initial tetromino position is central', ({ producer, expectedPosition }: InitialPositionTestCase) => {
    const game = new TetrisGame(producer);
    expect(game.active.position).toEqual(expectedPosition);
});

test('active tetromino descends when not obstructed', () => {
    const game = new TetrisGame();
    let [x, y] = game.active.position;
    game.tick();
    expect(game.active.position).toEqual([x, y - 1]);
});

test('active tetromino becomes fixed at base of play area', () => {
    const game = new TetrisGame();
    let tetromino = game.active;
    let [x, _] = tetromino.position;
    tetromino.position = [x, 1];
    game.tick();
    expect(game.active).not.toEqual(tetromino);
});

test.each([
    { producer: () => new GreenTetromino(), tetrominoAt: [2, 12], obstructedAt: [2, 10] },
    { producer: () => new GreenTetromino(), tetrominoAt: [2, 12], obstructedAt: [4, 11] },
    { producer: () => new RedTetromino(), tetrominoAt: [2, 12], obstructedAt: [2, 11] },
    { producer: () => new RedTetromino(), tetrominoAt: [2, 12], obstructedAt: [4, 10] },
] as ObstructedFromBelowTestCase[])('active tetromino becomes fixed when obstructed from below', ({ producer, tetrominoAt, obstructedAt }) => {
    const game = new TetrisGame(producer);
    const tetromino = game.active;
    tetromino.position = tetrominoAt;
    game.playArea.setBrickAt(obstructedAt, BrickColour.Blue);
    game.tick();
    expect(game.active).not.toEqual(tetromino);
});

test.each([
    { producer: () => new OrangeTetromino(), tetrominoAt: [2, 12], operation: "left", expectedPosition: [1, 12] },
    { producer: () => new OrangeTetromino(), tetrominoAt: [2, 12], operation: "right", expectedPosition: [3, 12] },
    { producer: () => new OrangeTetromino(), tetrominoAt: [2, 12], operation: "down", expectedPosition: [2, 11] }
] as UnobstructedMovementTestCase[])('active tetromino can move when not obstructed', ({ producer, tetrominoAt, operation, expectedPosition }) => {
    const game = new TetrisGame(producer);
    game.active.position = tetrominoAt;
    game[operation]();
    expect(game.active.position).toEqual(expectedPosition);
});

test.each([
    { producer: () => new GreenTetromino(), tetrominoAt: [2, 12], obstructedAt: [1, 11], operation: "left" },
    { producer: () => new GreenTetromino(), tetrominoAt: [0, 12], obstructedAt: undefined, operation: "left" },
    { producer: () => new GreenTetromino(), tetrominoAt: [2, 12], obstructedAt: [5, 12], operation: "right" },
    { producer: () => new GreenTetromino(), tetrominoAt: [7, 12], obstructedAt: undefined, operation: "right" },
    { producer: () => new GreenTetromino(), tetrominoAt: [2, 12], obstructedAt: [2, 10], operation: "down" },
    { producer: () => new GreenTetromino(), tetrominoAt: [2, 1], obstructedAt: undefined, operation: "down" }
] as ObstructedMovementTestCase[])('active tetromino can not move when obstructed', ({ producer, tetrominoAt, obstructedAt, operation }) => {
    const game = new TetrisGame(producer);
    const tetromino = game.active;
    tetromino.position = tetrominoAt;
    if (obstructedAt) {
        game.playArea.setBrickAt(obstructedAt, BrickColour.Blue);
    }
    game[operation]();
    expect(game.active.position).toEqual(tetrominoAt);
});