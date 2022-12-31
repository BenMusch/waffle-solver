import { Board, Color, Tile, transformBoard } from "./board";
import {
  possibleSolutionsFromBoard,
  renderSolution,
  SerializedSolution,
} from "./solution";
import { findSwaps } from "./swaps";
import assert from "assert";

const START_BOARD: Board<Tile> = [
  { letter: "P", color: Color.Green },
  { letter: "A", color: Color.Green },
  { letter: "E", color: Color.Yellow },
  { letter: "U", color: Color.Grey },
  { letter: "R", color: Color.Green },
  { letter: "E", color: Color.Grey },
  { letter: "L", color: Color.Grey },
  { letter: "O", color: Color.Yellow },
  { letter: "G", color: Color.Grey },
  { letter: "Y", color: Color.Yellow },
  { letter: "I", color: Color.Green },
  { letter: "R", color: Color.Grey },
  { letter: "M", color: Color.Grey },
  { letter: "N", color: Color.Grey },
  { letter: "M", color: Color.Green },
  { letter: "F", color: Color.Grey },
  { letter: "P", color: Color.Green },
  { letter: "E", color: Color.Yellow },
  { letter: "R", color: Color.Yellow },
  { letter: "A", color: Color.Grey },
  { letter: "N", color: Color.Green },
];

// AI questions
// - Is the goal just to produce the swap that eliminates the most options? Is
// there a secondary goal to look for options with the fewest swaps?
//
//
// EV(swap) == Swap that reduces avg. number of swaps for remaining valid
// boards

// Two approaches:
//  - Iterate over valid words, test board, see if produces same result
//  - Iterate over valid tile placements, test board words, see if produces same
//  result

// Serialize solutions as a string for simple comparision and storing in sets

function main(): void {
  const possibleSolutions: Set<SerializedSolution> =
    possibleSolutionsFromBoard(START_BOARD);

  for (const serializedSolution of possibleSolutions) {
    console.log(renderSolution(serializedSolution));
    console.log("--------------------------");
  }

  // TODO: figure out case where there are multiple solutions
  assert(possibleSolutions.size === 1);
  console.log(
    findSwaps(
      transformBoard(START_BOARD, (t) => t.letter).join(""),
      [...possibleSolutions.values()][0]!
    )
  );
}

main();
