import { YellowTetromino } from "./YellowTetromino";

type RotationTestCase = { times: number, expectedLayout: number[][] };

test('can create tetromino', () => {
    const tetromino = new YellowTetromino();
    expect(tetromino).toBeInstanceOf(YellowTetromino);
});

const layouts = [
    [ [1, 1], [1, 1] ],
    [ [1, 1], [1, 1] ],
    [ [1, 1], [1, 1] ],
    [ [1, 1], [1, 1] ]
];

test.each([
    { times: 0, expectedLayout: layouts[0] },
    { times: 1, expectedLayout: layouts[1] },
    { times: 2, expectedLayout: layouts[2] },
    { times: 3, expectedLayout: layouts[3] },
    { times: 4, expectedLayout: layouts[0] }
] as RotationTestCase[])('can rotate tetromino right', ({ times, expectedLayout }) => {
    const tetromino = new YellowTetromino();
    for (let i = 0; i < times; i++) {
        tetromino.rotateRight();
    }
    expect(tetromino.layout).toEqual(expectedLayout);
    expect(tetromino.rotation).toEqual(times);
});

test.each([
    { times: 0, expectedLayout: layouts[0] },
    { times: 1, expectedLayout: layouts[3] },
    { times: 2, expectedLayout: layouts[2] },
    { times: 3, expectedLayout: layouts[1] },
    { times: 4, expectedLayout: layouts[0] }
] as RotationTestCase[])('can rotate tetromino left', ({ times, expectedLayout }) => {
    const tetromino = new YellowTetromino();
    for (let i = 0; i < times; i++) {
        tetromino.rotateLeft();
    }
    expect(tetromino.layout).toEqual(expectedLayout);
    expect(tetromino.rotation).toEqual(0 - times);
});