import { SquareNumber, Letter } from "./board";
import { SerializedSolution } from "./solution";
import _ from "lodash";
import assert from "assert";

export type Swap = [SquareNumber, SquareNumber];

type SquareLookupEntry = {
  start: Letter;
  end: Letter;
  square: SquareNumber;
};

export function findSwaps(
  start: SerializedSolution,
  end: SerializedSolution
): Array<Swap> {
  // TODO: Can optimize to index with what we lookup by but the size of the list
  // is always 21 so doesnt really matter

  let squareLookup = new Array<SquareLookupEntry>();
  for (let i = 0; i < start.length; i++) {
    squareLookup.push({
      start: start[i]! as Letter,
      end: end[i]! as Letter,
      square: i as SquareNumber,
    });
  }
  console.log(squareLookup);
  const swaps = new Array<Swap>();

  return swaps;
}

function _buildMapFromStartToTarget(
  start: SerializedSolution,
  end: SerializedSolution
) {}

function findSwapsBasedOnLookup(
  squareLookup: Array<SquareLookupEntry>
): Set<Set<SquareLookupEntry>> {
  const groups = new Set<Set<SquareLookupEntry>>();

  while (squareLookup.length) {
    const curGroup = new Set<SquareLookupEntry>();
    const seenLetters = new Set<Letter>();
    let cur: SquareLookupEntry = squareLookup[0]!;

    if (cur.start === cur.end) {
      curGroup.add(cur);
    } else {
      while (!seenLetters.has(cur.end)) {
        seenLetters.add(cur.start);
        curGroup.add(cur);

        const candidatesForNext = squareLookup.filter((sl) => {
          return sl.start === cur.end && sl.start !== sl.end;
        });

        if (candidatesForNext.length === 0) {
          console.log(cur);
          console.log(squareLookup);
          assert(false);
        }

        const finalSquare = candidatesForNext.find((sl) =>
          seenLetters.has(sl.end)
        );

        if (finalSquare !== undefined) {
          curGroup.add(finalSquare);
          break;
        } else {
          curGroup.add(cur);
          seenLetters.add(cur.end);
          cur = [...candidatesForNext][0]!;
        }
      }
    }

    console.log(curGroup);
    groups.add(curGroup);

    for (const entry of curGroup) {
      squareLookup = squareLookup.filter((sl) => {
        return !_.isEqual(sl, entry);
      });
    }
  }
  console.log(groups);
  return groups;
}
