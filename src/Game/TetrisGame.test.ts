import { TetrisGame } from "./TetrisGame";
import { BlueTetromino, CyanTetromino, GreenTetromino, MagentaTetromino, OrangeTetromino, RedTetromino, Tetromino, TetrominoPosition, TetrominoProducer, YellowTetromino } from "./Tetrominoes";

type InitialPositionTestCase = { producer: TetrominoProducer, expectedPosition: TetrominoPosition }

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
    expect(game.playArea).toHaveLength(20);
    expect(game.playArea[0]).toHaveLength(10);
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

test('active tetromino descends on tick', () => {
    const game = new TetrisGame();
    let [x, y] = game.active.position;
    game.tick();
    expect (game.active.position).toEqual([x, y - 1]);
});

test('active tetromino becomes fixed at base of play area', () => {
    const game = new TetrisGame();
    let tetromino = game.active;
    let [x, _] = tetromino.position;
    tetromino.position = [x, 1];
    game.tick();
    expect (game.active).not.toEqual(tetromino);
});