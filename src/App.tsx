import React from "react";
import {
  Board,
  Tile,
  Letter,
  getColorOfSquare,
  Color,
  transformBoard,
} from "./lib/board";
import { possibleSolutionsFromBoard, renderSolution } from "./lib/solution";
import { Swap, findSwaps } from "./lib/swaps";
import { findBestSwap } from "./lib/swap_choser";
import "./App.css";

const LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as Array<Letter>;

function _nextColor(c: Color): Color {
  switch (c) {
    case Color.Grey:
      return Color.Yellow;
    case Color.Yellow:
      return Color.Green;
    case Color.Green:
      return Color.Grey;
  }
}

function TileComponent(props: {
  tile: Tile;
  onTileChange: (t: Tile) => void;
  editable: boolean;
}) {
  let backgroundColor: string;
  switch (props.tile?.color || Color.Grey) {
    case Color.Green: {
      backgroundColor = "green";
      break;
    }
    case Color.Yellow: {
      backgroundColor = "yellow";
      break;
    }
    case Color.Grey: {
      backgroundColor = "whitesmoke";
      break;
    }
  }
  return (
    <td style={{ width: "10em", height: "10em", backgroundColor }}>
      <select
        disabled={!props.editable}
        style={{ fontSize: "1.5em" }}
        onChange={(e) =>
          props.onTileChange({
            ...props.tile,
            letter: e.target.value as Letter,
          })
        }
        value={props.tile.letter || "A"}
      >
        {LETTERS.map((l) => {
          return (
            <option value={l} key={l}>
              {l}
            </option>
          );
        })}
      </select>
      <br />

      <button
        disabled={!props.editable}
        onClick={() =>
          props.onTileChange({
            ...props.tile,
            color: _nextColor(props.tile.color),
          })
        }
      >
        Toggle Color
      </button>
    </td>
  );
}

function BoardComponent(props: {
  board: Board<Tile>;
  onBoardChange: (b: Board<Tile>) => void;
  editable: boolean;
}) {
  const getOnTileChange = (n: number): ((t: Tile) => void) => {
    return (t: Tile) => {
      props.onBoardChange([
        ...props.board.slice(0, n),
        t,
        ...props.board.slice(n + 1, 21),
      ] as Board<Tile>);
    };
  };

  return (
    <table>
      <tr>
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[0]}
            onTileChange={getOnTileChange(0)}
          />
        }
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[1]}
            onTileChange={getOnTileChange(1)}
          />
        }
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[2]}
            onTileChange={getOnTileChange(2)}
          />
        }
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[3]}
            onTileChange={getOnTileChange(3)}
          />
        }
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[4]}
            onTileChange={getOnTileChange(4)}
          />
        }
      </tr>
      <tr>
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[5]}
            onTileChange={getOnTileChange(5)}
          />
        }
        {<td>_</td>}
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[6]}
            onTileChange={getOnTileChange(6)}
          />
        }
        {<td>_</td>}
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[7]}
            onTileChange={getOnTileChange(7)}
          />
        }
      </tr>
      <tr>
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[8]}
            onTileChange={getOnTileChange(8)}
          />
        }
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[9]}
            onTileChange={getOnTileChange(9)}
          />
        }
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[10]}
            onTileChange={getOnTileChange(10)}
          />
        }
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[11]}
            onTileChange={getOnTileChange(11)}
          />
        }
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[12]}
            onTileChange={getOnTileChange(12)}
          />
        }
      </tr>
      <tr>
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[13]}
            onTileChange={getOnTileChange(13)}
          />
        }
        {<td>_</td>}
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[14]}
            onTileChange={getOnTileChange(14)}
          />
        }
        {<td>_</td>}
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[15]}
            onTileChange={getOnTileChange(15)}
          />
        }
      </tr>
      <tr>
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[16]}
            onTileChange={getOnTileChange(16)}
          />
        }
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[17]}
            onTileChange={getOnTileChange(17)}
          />
        }
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[18]}
            onTileChange={getOnTileChange(18)}
          />
        }
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[19]}
            onTileChange={getOnTileChange(19)}
          />
        }
        {
          <TileComponent
            editable={props.editable}
            tile={props.board[20]}
            onTileChange={getOnTileChange(20)}
          />
        }
      </tr>
    </table>
  );
}

class App extends React.Component<
  {},
  {
    board: Board<Tile>;
    solution: Board<Letter> | null;
    swaps: Array<Swap>;
  }
> {
  constructor() {
    super({});
    this.state = {
      board: [
        { letter: "G", color: Color.Green },
        { letter: "R", color: Color.Green },
        { letter: "E", color: Color.Yellow },
        { letter: "A", color: Color.Grey },
        { letter: "E", color: Color.Green },
        { letter: "V", color: Color.Grey },
        { letter: "R", color: Color.Grey },
        { letter: "C", color: Color.Yellow },
        { letter: "O", color: Color.Grey },
        { letter: "I", color: Color.Yellow },
        { letter: "I", color: Color.Green },
        { letter: "P", color: Color.Grey },
        { letter: "F", color: Color.Grey },
        { letter: "L", color: Color.Grey },
        { letter: "N", color: Color.Green },
        { letter: "B", color: Color.Grey },
        { letter: "T", color: Color.Green },
        { letter: "A", color: Color.Yellow },
        { letter: "R", color: Color.Yellow },
        { letter: "V", color: Color.Grey },
        { letter: "T", color: Color.Green },
      ],
      swaps: [],
      solution: null,
    };
  }

  render() {
    const generateSolution = () => {
      const possibleSolutions = possibleSolutionsFromBoard(this.state.board);
      const startStr = transformBoard(this.state.board, (t) => t.letter).join(
        ""
      );

      if (possibleSolutions.size !== 1) {
        console.error(possibleSolutions);

        for (const solution of possibleSolutions) {
          console.log(renderSolution(solution));
        }

        const bestSwap = findBestSwap(startStr, new Set(possibleSolutions));
        this.setState({ swaps: [bestSwap], solution: null });
      } else {
        const solution = [...possibleSolutions][0]!;
        const swaps = findSwaps(startStr, solution);
        this.setState({
          solution: [...solution] as Board<Letter>,
          swaps,
        });
      }
    };

    const applyNextSwap = () => {
      const swap = this.state.swaps[0]!;
      swap.sort();
      const [from, to] = swap;

      const a = this.state.board[from];
      const b = this.state.board[to];

      const newA = {
        letter: b.letter,
        color: this.state.solution
          ? getColorOfSquare(b.letter, this.state.solution!, from)
          : Color.Grey,
      };

      const newB = {
        letter: a.letter,
        color: this.state.solution
          ? getColorOfSquare(a.letter, this.state.solution!, to)
          : Color.Grey,
      };

      let i = 0;
      const newBoard = this.state.board.map((t) => {
        let toReturn: Tile;
        if (i === from) {
          toReturn = newA;
        } else if (i === to) {
          toReturn = newB;
        } else {
          toReturn = t;
        }
        i++;
        return toReturn;
      });
      const newSwaps = this.state.swaps.slice(1);
      this.setState({ board: newBoard as Board<Tile>, swaps: newSwaps });
    };

    if (this.state.solution === null) {
      if (this.state.swaps.length > 0) {
        return (
          <div className="App">
            <BoardComponent
              board={this.state.board}
              editable={true}
              onBoardChange={(board) => this.setState({ board })}
            />
            <h2>
              Suggested swap{" "}
              <button
                style={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={applyNextSwap}
              >
                (apply next swap and manually update colors)
              </button>
              :
            </h2>
            <ol>
              {this.state.swaps.map((swap) => {
                return (
                  <li>
                    Square{swap[0]} 🔁 Square{swap[1]}
                  </li>
                );
              })}
              ;
            </ol>
          </div>
        );
      } else {
        return (
          <div className="App">
            <BoardComponent
              board={this.state.board}
              editable={true}
              onBoardChange={(board) => this.setState({ board })}
            />

            <button onClick={generateSolution}>Finalize</button>
          </div>
        );
      }
    } else {
      return (
        <div className="App">
          <BoardComponent
            board={this.state.board}
            editable={false}
            onBoardChange={(board) => this.setState({ board })}
          />
          <h2>
            Total solution{" "}
            <button
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={applyNextSwap}
            >
              (apply next swap)
            </button>
            :
          </h2>
          <ol>
            {this.state.swaps.map((swap) => {
              return (
                <li>
                  Square{swap[0]} 🔁 Square{swap[1]}
                </li>
              );
            })}
            ;
          </ol>
        </div>
      );
    }
  }
}

export default App;
