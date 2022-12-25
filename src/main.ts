import {
  Board,
  Word,
  WordLocation,
  Direction,
  Order,
  ALL_WORD_LOCATIONS,
  INTERSECTING_LETTER_LOCATIONS,
  getBoardItemFromLogicalLetterLocation,
  wordFromWordLocation,
} from "./board";

import _ from "lodash";
import { warn } from "console";

// TODO: Replace with all valid words
// TODO: Store this as a Trie
//          Can even be a fancy trie that indexes by remaining letters
const VALID_WORDS = new Set([
  "BEADY",
  "BEAST",
  "AVOID",
  "ALOFT",
  "YODEL",
  "TOTAL",
]);

// Encode the ordersible letters in the type system
export type Letter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

enum Color {
  Grey,
  Green,
  Yellow,
}

type LetterCount = Map<Letter, number>;
type Tile = { letter: Letter; color: Color };
type BoardWithState = Board<Tile>;

const START_BOARD: BoardWithState = [
  { letter: "B", color: Color.Green },
  { letter: "A", color: Color.Yellow },
  { letter: "E", color: Color.Yellow },
  { letter: "V", color: Color.Grey },
  { letter: "Y", color: Color.Green },
  { letter: "S", color: Color.Yellow },
  { letter: "T", color: Color.Yellow },
  { letter: "I", color: Color.Grey },
  { letter: "D", color: Color.Grey },
  { letter: "L", color: Color.Grey },
  { letter: "O", color: Color.Green },
  { letter: "E", color: Color.Grey },
  { letter: "D", color: Color.Green },
  { letter: "E", color: Color.Yellow },
  { letter: "O", color: Color.Grey },
  { letter: "O", color: Color.Yellow },
  { letter: "T", color: Color.Green },
  { letter: "A", color: Color.Yellow },
  { letter: "A", color: Color.Yellow },
  { letter: "F", color: Color.Grey },
  { letter: "L", color: Color.Green },
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

type Solution = Map<Direction, Map<Order, string>>;
// Serialize solutions as a string for simple comparision and storing in sets
type SerializedSolution = string;

function letterCounts(board: BoardWithState): LetterCount {
  const counts = new Map<Letter, number>();
  for (const tile of board) {
    counts.set(tile.letter, (counts.get(tile.letter) || 0) + 1);
  }
  return counts;
}

function boardFromSolution(solution: Solution): Board<Letter> {
  return [
    solution.get(Direction.Across)!.get(Order.First)![0]! as Letter,
    solution.get(Direction.Across)!.get(Order.First)![1]! as Letter,
    solution.get(Direction.Across)!.get(Order.First)![2]! as Letter,
    solution.get(Direction.Across)!.get(Order.First)![3]! as Letter,
    solution.get(Direction.Across)!.get(Order.First)![4]! as Letter,
    solution.get(Direction.Down)!.get(Order.First)![1]! as Letter,
    solution.get(Direction.Down)!.get(Order.Mid)![1]! as Letter,
    solution.get(Direction.Down)!.get(Order.Last)![1]! as Letter,
    solution.get(Direction.Across)!.get(Order.Mid)![0]! as Letter,
    solution.get(Direction.Across)!.get(Order.Mid)![1]! as Letter,
    solution.get(Direction.Across)!.get(Order.Mid)![2]! as Letter,
    solution.get(Direction.Across)!.get(Order.Mid)![3]! as Letter,
    solution.get(Direction.Across)!.get(Order.Mid)![4]! as Letter,
    solution.get(Direction.Down)!.get(Order.First)![3]! as Letter,
    solution.get(Direction.Down)!.get(Order.Mid)![3]! as Letter,
    solution.get(Direction.Down)!.get(Order.Last)![3]! as Letter,
    solution.get(Direction.Across)!.get(Order.Last)![0]! as Letter,
    solution.get(Direction.Across)!.get(Order.Last)![1]! as Letter,
    solution.get(Direction.Across)!.get(Order.Last)![2]! as Letter,
    solution.get(Direction.Across)!.get(Order.Last)![3]! as Letter,
    solution.get(Direction.Across)!.get(Order.Last)![4]! as Letter,
  ];
}

function renderSolution(solution: SerializedSolution): string {
  return [
    solution.slice(0, 5),
    `${solution[5]} ${solution[6]} ${solution[7]}`,
    solution.slice(8, 13),
    `${solution[13]} ${solution[14]} ${solution[15]}`,
    solution.slice(16),
  ].join("\n");
}

function serialize(solution: Solution): SerializedSolution {
  return boardFromSolution(solution).join("");
}

function solutionHasValidIntersections(solution: Solution) {
  for (const [locationA, locationB] of INTERSECTING_LETTER_LOCATIONS) {
    const wordA = solution.get(locationA.dir)!.get(locationA.order)!;
    const wordB = solution.get(locationB.dir)!.get(locationB.order)!;

    if (wordA[locationA.letterNum] !== wordB[locationB.letterNum]) {
      return false;
    }
  }
  return true;
}

// TODO: Take into account yellow tiles
function tilesCouldBeWord(tiles: Word<Tile>, word: Word<Letter>) {
  const tilesAsWord = tiles.map((tile) => tile.letter);
  return _.isEqual(tilesAsWord, word);
}

// TODO: This function is *extremely* brute force
function possibleSolutionsFromBoard(
  board: BoardWithState
): Set<SerializedSolution> {
  return _getInitialSolutionPossibilities(board);
  // Place all the green tiles
  // Shuffle the yellow ones
  // IDEA:
  //  - Start with all possible solutions that fit the green tiles
  //  - Eliminate ones which dont match the letter counts
  //  - Eliminiate the ones which don't fit the yellow/grey
}

function wordsFittingLetters(
  letters: Word<Letter | null>,
  possibleWords: Set<string>
): Set<string> {
  const possibilities = new Set<string>();

  // TODO: This is what would most benefit from a Trie
  for (const word of possibleWords) {
    let isMatch = true;

    for (let i = 0; i < 5; i++) {
      if (letters[i] !== null) {
        if (letters[i] !== word[i]) {
          isMatch = false;
          break;
        }
      }
    }

    if (isMatch) {
      possibilities.add(word);
    }
  }

  return possibilities;
}

// Returns the available solutions which fit the green tiles
// Because we iterate over valid words here, we only get valid solutions
function _getInitialSolutionPossibilities(
  board: BoardWithState
): Set<SerializedSolution> {
  const possibleWords = new Map<Direction, Map<Order, Set<string>>>();

  // TODO: need to check shared letters are the same
  for (const wordLocation of ALL_WORD_LOCATIONS) {
    const wordOfTiles = wordFromWordLocation(board, wordLocation);

    const greenTiles = wordOfTiles.map((tile) => {
      return tile.color === Color.Green ? tile.letter : null;
    }) as Word<Letter | null>;

    if (!possibleWords.has(wordLocation.dir)) {
      possibleWords.set(wordLocation.dir, new Map());
    }
    possibleWords
      .get(wordLocation.dir)!
      .set(wordLocation.order, wordsFittingLetters(greenTiles, VALID_WORDS));
  }

  const solutionPermutations = new Set<SerializedSolution>();

  const getWords = (dir: Direction, ord: Order) => {
    return possibleWords.get(dir)!.get(ord)!;
  };

  // TODO this is ugly
  for (const topAcross of getWords(Direction.Across, Order.First)) {
    for (const midAcross of getWords(Direction.Across, Order.Mid)) {
      for (const botAcross of getWords(Direction.Across, Order.Last)) {
        for (const leftDown of getWords(Direction.Down, Order.First)) {
          for (const midDown of getWords(Direction.Down, Order.Mid)) {
            for (const rightDown of getWords(Direction.Down, Order.Last)) {
              const solution: Solution = new Map([
                [
                  Direction.Across,
                  new Map([
                    [Order.First, topAcross],
                    [Order.Mid, midAcross],
                    [Order.Last, botAcross],
                  ]),
                ],
                [
                  Direction.Down,
                  new Map([
                    [Order.First, leftDown],
                    [Order.Mid, midDown],
                    [Order.Last, rightDown],
                  ]),
                ],
              ]);

              if (!solutionHasValidIntersections(solution)) {
                continue;
              }

              // too lazy to check for duplicate words, probably not worth it
              solutionPermutations.add(serialize(solution));
            }
          }
        }
      }
    }
  }

  return solutionPermutations;
}

function isSolved(game: BoardWithState) {}

function main(): void {
  const possibleSolutionsBasedOnGreenTiles =
    _getInitialSolutionPossibilities(START_BOARD);

  for (const serializedSolution of possibleSolutionsBasedOnGreenTiles) {
    console.log(renderSolution(serializedSolution));
    console.log("--------------------------");
  }
}

main();
