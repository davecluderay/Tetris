import { GreenTetromino } from './GreenTetromino';
import { RedTetromino } from './RedTetromino';
import { produceRandomTetromino } from './TetrominoProducer';

test('does not produce a red-green sequence longer than four', () => {
    let redGreenSequenceLength = 0;
    for (let i = 0; i < 2000; i++) {
        const tetromino = produceRandomTetromino();
        const isRedGreen = (tetromino instanceof RedTetromino || tetromino instanceof GreenTetromino);
        redGreenSequenceLength = isRedGreen ? redGreenSequenceLength + 1 : 0;
        expect(redGreenSequenceLength).toBeLessThanOrEqual(4);
    }
});

test('produces all tetrominos', () => {
    const set = new Set();
    for (let i = 0; i < 2000; i++) {
        set.add(produceRandomTetromino().colour);
        if (set.size == 7) break;
    }
    expect(set.size).toBe(7);
});
