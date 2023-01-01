import { SerializedSolution } from "./solution";
import { findSwaps, Swap } from "./swaps";
import { SquareNumber } from "./board";

function _applySwap(board: SerializedSolution, swap: Swap): SerializedSolution {
  const letters = board.split("");
  const tmp = letters[swap[0]];
  letters[swap[0]] = letters[swap[1]];
  letters[swap[1]] = tmp;
  return letters.join("");
}

// In the case where there are multiple solutions,
// perform the swaps which reduce the average number of remaining swaps the most
export function findBestSwap(
  start: SerializedSolution,
  ends: Iterable<SerializedSolution>
): Swap {
  console.log("ends", ends);
  const swapScores = new Map<SquareNumber, Map<SquareNumber, number>>();

  for (let from = 0; from < start.length; from++) {
    const curScores = new Map<SquareNumber, number>();
    for (let to = from + 1; to < start.length; to++) {
      let sum = 0;
      const startWithSwap = _applySwap(start, [
        from as SquareNumber,
        to as SquareNumber,
      ]);
      for (const solution of ends) {
        const swapsRemaining = findSwaps(startWithSwap, solution);
        sum += swapsRemaining.length;
      }
      curScores.set(to as SquareNumber, sum);
    }
    swapScores.set(from as SquareNumber, curScores);
  }

  let minSwap = [0, 0];
  let minScore = Infinity;

  for (const [from, toMap] of swapScores.entries()) {
    for (const [to, score] of toMap.entries()) {
      if (score < minScore) {
        minSwap = [from, to];
        minScore = score;
      }
    }
  }

  console.log(minScore / [...ends].length);
  console.log(minSwap);
  return minSwap as Swap;
}
