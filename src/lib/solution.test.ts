import { Color } from "./board";
import { possibleSolutionsFromBoard } from "./solution";

test("scenario 1", () => {
  const solutions = possibleSolutionsFromBoard([
    { letter: "P", color: Color.Green },
    { letter: "I", color: Color.Green },
    { letter: "L", color: Color.Yellow },
    { letter: "T", color: Color.Grey },
    { letter: "A", color: Color.Green },
    { letter: "Z", color: Color.Grey },
    { letter: "I", color: Color.Grey },
    { letter: "N", color: Color.Yellow },
    { letter: "Z", color: Color.Grey },
    { letter: "O", color: Color.Yellow },
    { letter: "N", color: Color.Green },
    { letter: "O", color: Color.Grey },
    { letter: "C", color: Color.Grey },
    { letter: "A", color: Color.Grey },
    { letter: "A", color: Color.Green },
    { letter: "G", color: Color.Grey },
    { letter: "H", color: Color.Green },
    { letter: "V", color: Color.Yellow },
    { letter: "A", color: Color.Yellow },
    { letter: "L", color: Color.Yellow },
    { letter: "E", color: Color.Green },
  ]);

  expect(solutions.size).toEqual(1);
  expect([...solutions][0]!).toEqual("PIZZAIOLTANGOCANHALVE");
});
