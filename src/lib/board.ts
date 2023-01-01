export const BOARD_SIZE = 21;
// Represents all ordersible placements of a letter on the grid, numbers from
// left-to-right top-to-bottom
export type SquareNumber =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

// Represents the order of a row or column
export enum Order {
  First,
  Mid,
  Last,
}

export enum Direction {
  Across,
  Down,
}

export enum Color {
  Grey,
  Green,
  Yellow,
}

// Represents the location of a letter in a word from left-to-right
export type LetterNumber = 0 | 1 | 2 | 3 | 4;
// Identifies a unique word
export type WordLocation = { dir: Direction; order: Order };
// Represents the location of a tile within a specific word
export type LogicalLetterLocation = WordLocation & {
  letterNum: LetterNumber;
};

function makeLocation(
  dir: Direction,
  order: Order,
  letterNum: LetterNumber
): LogicalLetterLocation {
  return { dir, order, letterNum };
}

export type WordLookup<T> = { [d in Direction]: { [o in Order]: Word<T> } };

// Board is represented as the tiles read from left-to-right, top-to-bottom
export type Board<T> = [
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T
];
export type Word<T> = [T, T, T, T, T];

export const ALL_WORD_LOCATIONS = [
  { dir: Direction.Across, order: Order.First },
  { dir: Direction.Across, order: Order.Mid },
  { dir: Direction.Across, order: Order.Last },
  { dir: Direction.Down, order: Order.First },
  { dir: Direction.Down, order: Order.Mid },
  { dir: Direction.Down, order: Order.Last },
];

/* constants of all the locations for readability */
const TOP_ACR_1 = makeLocation(Direction.Across, Order.First, 0);
const TOP_ACR_2 = makeLocation(Direction.Across, Order.First, 1);
const TOP_ACR_3 = makeLocation(Direction.Across, Order.First, 2);
const TOP_ACR_4 = makeLocation(Direction.Across, Order.First, 3);
const TOP_ACR_5 = makeLocation(Direction.Across, Order.First, 4);

const MID_ACR_1 = makeLocation(Direction.Across, Order.Mid, 0);
const MID_ACR_2 = makeLocation(Direction.Across, Order.Mid, 1);
const MID_ACR_3 = makeLocation(Direction.Across, Order.Mid, 2);
const MID_ACR_4 = makeLocation(Direction.Across, Order.Mid, 3);
const MID_ACR_5 = makeLocation(Direction.Across, Order.Mid, 4);

const BOT_ACR_1 = makeLocation(Direction.Across, Order.Last, 0);
const BOT_ACR_2 = makeLocation(Direction.Across, Order.Last, 1);
const BOT_ACR_3 = makeLocation(Direction.Across, Order.Last, 2);
const BOT_ACR_4 = makeLocation(Direction.Across, Order.Last, 3);
const BOT_ACR_5 = makeLocation(Direction.Across, Order.Last, 4);

const LEFT_DOWN_1 = makeLocation(Direction.Down, Order.First, 0);
const LEFT_DOWN_2 = makeLocation(Direction.Down, Order.First, 1);
const LEFT_DOWN_3 = makeLocation(Direction.Down, Order.First, 2);
const LEFT_DOWN_4 = makeLocation(Direction.Down, Order.First, 3);
const LEFT_DOWN_5 = makeLocation(Direction.Down, Order.First, 4);

const MID_DOWN_1 = makeLocation(Direction.Down, Order.Mid, 0);
const MID_DOWN_2 = makeLocation(Direction.Down, Order.Mid, 1);
const MID_DOWN_3 = makeLocation(Direction.Down, Order.Mid, 2);
const MID_DOWN_4 = makeLocation(Direction.Down, Order.Mid, 3);
const MID_DOWN_5 = makeLocation(Direction.Down, Order.Mid, 4);

const RIGHT_DOWN_1 = makeLocation(Direction.Down, Order.Last, 0);
const RIGHT_DOWN_2 = makeLocation(Direction.Down, Order.Last, 1);
const RIGHT_DOWN_3 = makeLocation(Direction.Down, Order.Last, 2);
const RIGHT_DOWN_4 = makeLocation(Direction.Down, Order.Last, 3);
const RIGHT_DOWN_5 = makeLocation(Direction.Down, Order.Last, 4);

const SQUARE_NUMBERS_BY_LOGICAL_LETTER_LOCATION: WordLookup<SquareNumber> = {
  [Direction.Across]: {
    [Order.First]: [0, 1, 2, 3, 4],
    [Order.Mid]: [8, 9, 10, 11, 12],
    [Order.Last]: [16, 17, 18, 19, 20],
  },
  [Direction.Down]: {
    [Order.First]: [0, 5, 8, 13, 16],
    [Order.Mid]: [2, 6, 10, 14, 18],
    [Order.Last]: [4, 7, 12, 15, 20],
  },
};

export const LETTER_LOCATIONS_BY_SQUARE_NUMBER: Map<
  SquareNumber,
  Iterable<LogicalLetterLocation>
> = new Map([
  [0, [TOP_ACR_1, LEFT_DOWN_1]],
  [1, [TOP_ACR_2]],
  [2, [TOP_ACR_3, MID_DOWN_1]],
  [3, [TOP_ACR_4]],
  [4, [TOP_ACR_5, RIGHT_DOWN_1]],
  [5, [LEFT_DOWN_2]],
  [6, [MID_DOWN_2]],
  [7, [RIGHT_DOWN_2]],
  [8, [MID_ACR_1, LEFT_DOWN_3]],
  [9, [MID_ACR_2]],
  [10, [MID_ACR_3, MID_DOWN_3]],
  [11, [MID_ACR_4]],
  [12, [MID_ACR_5, RIGHT_DOWN_3]],
  [13, [LEFT_DOWN_4]],
  [14, [MID_DOWN_4]],
  [15, [RIGHT_DOWN_4]],
  [16, [BOT_ACR_1, LEFT_DOWN_5]],
  [17, [BOT_ACR_2]],
  [18, [BOT_ACR_3, MID_DOWN_5]],
  [19, [BOT_ACR_4]],
  [20, [BOT_ACR_5, RIGHT_DOWN_5]],
]);

export function wordLocationsForSquareNumber(
  squareNumber: SquareNumber
): Iterable<WordLocation> {
  return LETTER_LOCATIONS_BY_SQUARE_NUMBER.get(squareNumber)!;
}

export function transformBoard<T, U>(
  board: Board<T>,
  transformFn: (
    item: T,
    squareNum: SquareNumber,
    letterLocs: Iterable<LogicalLetterLocation>
  ) => U
): Board<U> {
  let i: SquareNumber = 0;
  return board.map((item) => {
    const returnVal = transformFn(
      item,
      i,
      LETTER_LOCATIONS_BY_SQUARE_NUMBER.get(i)!
    );
    i += 1;
    return returnVal;
  }) as Board<U>;
}

export function getBoardItemFromLogicalLetterLocation<T>(
  board: Board<T>,
  letterLoc: LogicalLetterLocation
): T {
  const i =
    SQUARE_NUMBERS_BY_LOGICAL_LETTER_LOCATION[letterLoc.dir][letterLoc.order][
      letterLoc.letterNum
    ];
  return board[i];
}

export function getColorOfSquare(
  letter: Letter,
  solutionBoard: Board<Letter>,
  squareNumber: SquareNumber
): Color {
  const letterLocations = LETTER_LOCATIONS_BY_SQUARE_NUMBER.get(squareNumber)!;

  for (const letterLoc of letterLocations) {
    const word = wordFromWordLocation(solutionBoard, letterLoc);
    if (word[letterLoc.letterNum] === letter) {
      return Color.Green;
    } else if (word.some((l) => l === letter)) {
      return Color.Yellow;
    }
  }

  return Color.Grey;
}

export function wordFromWordLocation<T>(
  board: Board<T>,
  wordLoc: WordLocation
): Word<T> {
  return [
    getBoardItemFromLogicalLetterLocation(board, {
      ...wordLoc,
      letterNum: 0,
    }),
    getBoardItemFromLogicalLetterLocation(board, {
      ...wordLoc,
      letterNum: 1,
    }),
    getBoardItemFromLogicalLetterLocation(board, {
      ...wordLoc,
      letterNum: 2,
    }),
    getBoardItemFromLogicalLetterLocation(board, {
      ...wordLoc,
      letterNum: 3,
    }),
    getBoardItemFromLogicalLetterLocation(board, {
      ...wordLoc,
      letterNum: 4,
    }),
  ];
}

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

export type Tile = { letter: Letter; color: Color };
