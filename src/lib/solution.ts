// note that "solution" in terms of this package refers to the
// words placed in the grid, not to the swaps to get there.
import _ from "lodash";
import {
  Board,
  Word,
  Direction,
  Order,
  ALL_WORD_LOCATIONS,
  wordFromWordLocation,
  Tile,
  Letter,
} from "./board";
import { searchWord } from "./words";

// TODO: Replace with all valid words
// TODO: Store this as a Trie
//          Can even be a fancy trie that indexes by remaining letters

export type LetterCount = { [l in Letter]?: number };
export type LetterCountConstraintChecker = {
  [l in Letter]?: { current: number; max: number };
};

export type Solution = Map<Direction, Map<Order, string>>;
export type SerializedSolution = string;

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

export function renderSolution(solution: SerializedSolution): string {
  return [
    solution.slice(0, 5),
    `${solution[5]} ${solution[6]} ${solution[7]}`,
    solution.slice(8, 13),
    `${solution[13]} ${solution[14]} ${solution[15]}`,
    solution.slice(16),
  ].join("\n");
}

function initialLetterCountChecker(
  board: Board<Tile>
): LetterCountConstraintChecker {
  const counts: LetterCount = {};
  for (const tile of board) {
    counts[tile.letter] = (counts[tile.letter] || 0) + 1;
  }

  const checker: LetterCountConstraintChecker = {};
  for (const [letter, count] of Object.entries(counts)) {
    checker[letter as Letter] = { max: count, current: 0 };
  }
  return checker;
}

export function serialize(solution: Solution): SerializedSolution {
  return boardFromSolution(solution).join("");
}

// TODO: Add more rules about validity
export function possibleSolutionsFromBoard(
  board: Board<Tile>
): Set<SerializedSolution> {
  return _getInitialSolutionPossibilities(board);
}

function wordsFittingTiles(tiles: Word<Tile>): Set<string> {
  return searchWord(tiles);
}

function updatedLetterCountConstraintIfValid(
  start: LetterCountConstraintChecker,
  word: string
): LetterCountConstraintChecker | null {
  const toReturn = _.cloneDeep(start);
  for (const letter of word) {
    if (
      !toReturn[letter as Letter] ||
      toReturn[letter as Letter]!.current >= toReturn[letter as Letter]!.max
    ) {
      return null;
    }

    toReturn[letter as Letter]!.current += 1;
  }
  return toReturn;
}

// Returns the available solutions which fit the green tiles
// Because we iterate over valid words here, we only get valid solutions
function _getInitialSolutionPossibilities(
  board: Board<Tile>
): Set<SerializedSolution> {
  const possibleWords = new Map<Direction, Map<Order, Set<string>>>();
  const letterCountChecker = initialLetterCountChecker(board);

  // TODO: need to check shared letters are the same
  for (const wordLocation of ALL_WORD_LOCATIONS) {
    const wordOfTiles = wordFromWordLocation(board, wordLocation);

    if (!possibleWords.has(wordLocation.dir)) {
      possibleWords.set(wordLocation.dir, new Map());
    }
    possibleWords
      .get(wordLocation.dir)!
      .set(wordLocation.order, wordsFittingTiles(wordOfTiles));
  }

  const solutionPermutations = new Set<SerializedSolution>();

  const getWords = (dir: Direction, ord: Order) => {
    return possibleWords.get(dir)!.get(ord)!;
  };

  // TODO: Do validity check of having the yellow tiles (if non-intersecting
  // square)

  // TODO this is ugly
  // TODO: Consider an approach where we don't generate every possible solution
  // and then filter, and instead break the moment a solution becomes invalid
  // this would save on memory
  for (const topAcross of getWords(Direction.Across, Order.First)) {
    const constraintsTopAcross = updatedLetterCountConstraintIfValid(
      letterCountChecker,
      topAcross
    );

    if (constraintsTopAcross === null) {
      continue;
    }

    for (const midAcross of getWords(Direction.Across, Order.Mid)) {
      const constraintsMidAcross = updatedLetterCountConstraintIfValid(
        constraintsTopAcross,
        midAcross
      );

      if (constraintsMidAcross === null) {
        continue;
      }

      for (const botAcross of getWords(Direction.Across, Order.Last)) {
        const constraintsBotAcross = updatedLetterCountConstraintIfValid(
          constraintsMidAcross,
          botAcross
        );

        if (constraintsBotAcross === null) {
          continue;
        }

        for (const leftDown of getWords(Direction.Down, Order.First)) {
          const constraintsLeftDown = updatedLetterCountConstraintIfValid(
            constraintsBotAcross,
            `${leftDown[1]}${leftDown[3]}`
          );

          if (constraintsLeftDown === null) {
            continue;
          }

          if (
            leftDown[0] !== topAcross[0] ||
            leftDown[2] !== midAcross[0] ||
            leftDown[4] !== botAcross[0]
          ) {
            continue;
          }

          for (const midDown of getWords(Direction.Down, Order.Mid)) {
            const constraintsMidDown = updatedLetterCountConstraintIfValid(
              constraintsLeftDown,
              `${midDown[1]}${midDown[3]}`
            );

            if (
              midDown[0] !== topAcross[2] ||
              midDown[2] !== midAcross[2] ||
              midDown[4] !== botAcross[2]
            ) {
              continue;
            }

            if (constraintsMidDown === null) {
              continue;
            }

            for (const rightDown of getWords(Direction.Down, Order.Last)) {
              const constraintsRightDown = updatedLetterCountConstraintIfValid(
                constraintsMidDown,
                `${rightDown[1]}${rightDown[3]}`
              );

              if (constraintsRightDown === null) {
                continue;
              }

              if (
                rightDown[0] !== topAcross[4] ||
                rightDown[2] !== midAcross[4] ||
                rightDown[4] !== botAcross[4]
              ) {
                continue;
              }

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

              // too lazy to check for duplicate words, probably not worth it
              const serializedSolution = serialize(solution);
              solutionPermutations.add(serializedSolution);
            }
          }
        }
      }
    }
  }

  return solutionPermutations;
}
