import { TetrisGame } from "./TetrisGame";
import { BlueTetromino, CyanTetromino, GreenTetromino, MagentaTetromino, OrangeTetromino, RedTetromino, Tetromino, TetrominoProducer, YellowTetromino } from "./Tetrominoes";
import { BrickColour, Position } from "./SharedTypes";
import { PlayArea } from "./PlayArea";

const areaWidth = PlayArea.width;
const areaVisibleHeight = PlayArea.visibleHeight;
const areaMidHeight = Math.floor(areaVisibleHeight / 2);

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
    expect(game.playArea.visibleHeight).toBe(areaVisibleHeight);
    expect(game.playArea.width).toBe(areaWidth);
});

test.each([
    { producer: () => new BlueTetromino(), expectedPosition: [areaWidth / 2 - 3, areaVisibleHeight + 1] },
    { producer: () => new CyanTetromino(), expectedPosition: [areaWidth / 2 - 3, areaVisibleHeight + 1] },
    { producer: () => new GreenTetromino(), expectedPosition: [areaWidth / 2 - 3, areaVisibleHeight + 1] },
    { producer: () => new MagentaTetromino(), expectedPosition: [areaWidth / 2 - 3, areaVisibleHeight + 1] },
    { producer: () => new OrangeTetromino(), expectedPosition: [areaWidth / 2 - 3, areaVisibleHeight + 1] },
    { producer: () => new RedTetromino(), expectedPosition: [areaWidth / 2 - 3, areaVisibleHeight + 1] },
    { producer: () => new YellowTetromino(), expectedPosition: [areaWidth / 2 - 2, areaVisibleHeight + 1] }
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

test('active tetromino becomes locked at base of play area', () => {
    const game = new TetrisGame();
    let tetromino = game.active;
    let [x, _] = tetromino.position;
    tetromino.position = [x, 1];
    game.tick();
    expect(game.active).not.toEqual(tetromino);
});

test.each([
    { producer: () => new GreenTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [2, areaMidHeight - 2] },
    { producer: () => new GreenTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [4, areaMidHeight - 1] },
    { producer: () => new RedTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [2, areaMidHeight - 1] },
    { producer: () => new RedTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [4, areaMidHeight - 2] },
] as ObstructedFromBelowTestCase[])('active tetromino becomes locked when obstructed from below', ({ producer, tetrominoAt, obstructedAt }) => {
    const game = new TetrisGame(producer);
    const tetromino = game.active;
    tetromino.position = tetrominoAt;
    game.playArea.setBrickAt(obstructedAt, BrickColour.Blue);
    game.tick();
    expect(game.active).not.toEqual(tetromino);
});

test.each([
    { producer: () => new OrangeTetromino(), tetrominoAt: [2, areaMidHeight], operation: "left", expectedPosition: [1, areaMidHeight] },
    { producer: () => new OrangeTetromino(), tetrominoAt: [2, areaMidHeight], operation: "right", expectedPosition: [3, areaMidHeight] },
    { producer: () => new OrangeTetromino(), tetrominoAt: [2, areaMidHeight], operation: "down", expectedPosition: [2, areaMidHeight - 1] }
] as UnobstructedMovementTestCase[])('active tetromino can move when not obstructed', ({ producer, tetrominoAt, operation, expectedPosition }) => {
    const game = new TetrisGame(producer);
    game.active.position = tetrominoAt;
    game[operation]();
    expect(game.active.position).toEqual(expectedPosition);
});

test.each([
    { producer: () => new GreenTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [1, areaMidHeight - 1], operation: "left" },
    { producer: () => new GreenTetromino(), tetrominoAt: [0, areaMidHeight], obstructedAt: undefined, operation: "left" },
    { producer: () => new GreenTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [5, areaMidHeight], operation: "right" },
    { producer: () => new GreenTetromino(), tetrominoAt: [7, areaMidHeight], obstructedAt: undefined, operation: "right" },
    { producer: () => new GreenTetromino(), tetrominoAt: [2, areaMidHeight], obstructedAt: [2, areaMidHeight - 2], operation: "down" },
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