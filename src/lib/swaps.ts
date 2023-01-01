import { SquareNumber, Letter } from "./board";
import { SerializedSolution } from "./solution";
import _ from "lodash";

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

  const startToTargetMap = _buildMapFromStartToTarget(start, end);

  const remainingSquareNumbers = new Set<SquareNumber>();
  for (let i = 0; i < start.length; i++) {
    remainingSquareNumbers.add(i as SquareNumber);
  }

  const swaps: Array<Swap> = [];
  while (remainingSquareNumbers.size > 0) {
    const cur = [...remainingSquareNumbers][0]!;
    const curGroup = _buildInitialGroup(startToTargetMap, cur);

    for (const sn of curGroup) {
      remainingSquareNumbers.delete(sn);
    }

    const lookupForGroup: Array<SquareLookupEntry> = [];
    for (const sn of curGroup) {
      lookupForGroup.push({
        square: sn,
        start: start[sn] as Letter,
        end: end[sn] as Letter,
      });
    }

    const dividedGroup = _divideGroupFurther(lookupForGroup);
    for (const subGroup of dividedGroup) {
      if (subGroup.size === 1) {
        continue;
      }
      let squareNumbers = [...subGroup].map((sl) => sl.square);
      for (let i = 0; i < squareNumbers.length - 1; i++) {
        let swap: Swap;
        if (squareNumbers[i] < squareNumbers[i + 1]) {
          swap = [squareNumbers[i], squareNumbers[i + 1]];
        } else {
          swap = [squareNumbers[i + 1], squareNumbers[i]];
        }
        swaps.push(swap);
      }
    }
  }

  return swaps;
}

function _buildMapFromStartToTarget(
  start: SerializedSolution,
  end: SerializedSolution
): Map<SquareNumber, SquareNumber> {
  const availableEnds = new Set<SquareNumber>();
  const toReturn = new Map<SquareNumber, SquareNumber>();
  for (let i = 0; i < start.length; i++) {
    availableEnds.add(i as SquareNumber);
  }

  for (let i = 0; i < start.length; i++) {
    if (start[i] === end[i]) {
      availableEnds.delete(i as SquareNumber);
      toReturn.set(i as SquareNumber, i as SquareNumber);
      continue;
    }

    for (let j = 0; j < start.length; j++) {
      if (
        !availableEnds.has(j as SquareNumber) ||
        start[j] === end[j] ||
        start[i] !== end[j]
      ) {
        continue;
      }

      toReturn.set(i as SquareNumber, j as SquareNumber);
      availableEnds.delete(j as SquareNumber);
      break;
    }
  }

  return toReturn;
}

function _buildInitialGroup(
  map: Map<SquareNumber, SquareNumber>,
  start: SquareNumber
): Set<SquareNumber> {
  let cur = start;
  const group = new Set<SquareNumber>();
  while (!group.has(cur)) {
    group.add(cur);
    cur = map.get(cur)!;
  }
  return group;
}

function _divideGroupFurther(
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

    for (const entry of curGroup) {
      squareLookup = squareLookup.filter((sl) => {
        return !_.isEqual(sl, entry);
      });
    }

    groups.add(curGroup);
  }
  return groups;
}
