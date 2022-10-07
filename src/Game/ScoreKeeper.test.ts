import { ScoreKeeper } from './ScoreKeeper';

test.each([
    [1, 100],
    [2, 200],
    [3, 400],
    [4, 800]
])('scores appropriately based on rows destroyed', (rowsDestroyed, expectedScore) => {
    const scoreKeeper = new ScoreKeeper();
    scoreKeeper.record(rowsDestroyed);
    expect(scoreKeeper.score).toBe(expectedScore);
});

test('scores extra for continuous runs of four', () => {
    const sequence = [
        [1, 100],
        [2, 300],
        [4, 1100],
        [1, 1200],
        [4, 2000],
        [4, 3200],
        [3, 3600]
    ];
    const scoreKeeper = new ScoreKeeper();
    for (let [rowsDestroyed, expectedScore] of sequence) {
        scoreKeeper.record(rowsDestroyed);
        expect(scoreKeeper.score).toBe(expectedScore);
    }
});