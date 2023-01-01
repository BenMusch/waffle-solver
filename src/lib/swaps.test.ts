import { findSwaps, Swap } from "./swaps";

// Sanity check before checking the specific swaps in output
// If a test fails with the specific swaps but passes this stage,
// then the implementation changed the way it outputs the swaps but
// has not produced an incorrect result
function simulateSwaps(start: string, swaps: Array<Swap>): string {
  const letters = start.split("");
  for (const [from, to] of swaps) {
    const tmp = letters[from];
    letters[from] = letters[to];
    letters[to] = tmp;
  }
  return letters.join("");
}

test("scenario 1", () => {
  const start = "PILTAZINZONOCAAGHVALE";
  const end = "PIZZAIOLTANGOCANHALVE";
  const swaps = findSwaps(start, end);
  expect(simulateSwaps(start, swaps)).toEqual(end);
  expect(swaps).toEqual([
    [2, 5],
    [5, 6],
    [6, 11],
    [11, 15],
    [7, 15],
    [9, 12],
    [9, 13],
    [3, 8],
    [17, 18],
    [18, 19],
  ]);
});
