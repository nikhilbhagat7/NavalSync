// import { attack, isGameOver } from "./game/attack";
// import createBoard from "./game/board";
// import randomPlaceShips from "./game/placement";
// import ships from "./game/ships";
// import printBoard from "./utils/printer"; 
import createGame from "./game/gameManager";
import GameScreen from "./components/GameScreen"
import { useState } from 'react';

function App() {

  const [game] = useState(() => createGame());
  console.log(game.player1.board);

  //temp funct just for noww
  const displayCell = (cell, hideShip) => {
    if(hideShip && ["C","B","R","S","D"].includes(cell))
      return "~";
    return cell;
  }

  const tableStyle = {
    display: "inline-block",
    width: "30px", height: "30px",
    border: "1px solid black",
    textAlign: "center", 
    lineHeight: "30px"
  };

  const [, forceRender] = useState(0);
  const [lastResult, setLastResult] = useState("");
  const handleAttack = (row, col, boardClicked) => {
    console.log(`BEFORE : ${game.status}`)
    if (game.winner) return;
    if (game.currentTurn === "player1" && boardClicked !== "opponent") return;
    if (game.currentTurn === "player2" && boardClicked !== "player") return;

    const result = game.playTurn(row, col);
    if (result === "already attacked") return;

    setLastResult(result);
    forceRender(n => n + 1); // just triggers re-render
    // ^ edge case like: "hit" followed by another "hit" where setLastResult(result) the second time does nothing
    console.log(`AFTER : ${game.status}`)
  }

  // return <GameScreen />;

  return (
    <div>
      <h2>Current Turn: {game.currentTurn}</h2>
      <h2>Status: {game.status}</h2>
      <h2>
        Winner: {game.winner ? game.winner : "none"}
      </h2>
      <h2>Last Move: {lastResult || "none"}</h2>

      <h1>OPPONENT BOARD</h1>
      {game.player2.board.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((elem, colIndex) => (
              <span 
                key={colIndex}
                style= {{
                  ...tableStyle,
                  backgroundColor:
                  elem==="X" ? "red" :
                  elem==="O" ? "lightblue" :
                  elem==="~" ? "lightgrey" :
                  "red"}}
                  onClick={() => handleAttack(rowIndex, colIndex, "opponent")}>
                {displayCell(elem,true)}
              </span>
          ))}
        </div>
      ))}

      <h1>PLAYER BOARD</h1>
      {game.player1.board.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((elem, colIndex) => (
            <span //Inline element and styling them
              key={colIndex}
              style={{
                ...tableStyle,
                backgroundColor:
                elem==="X" ? "red" :
                elem==="O" ? "lightblue" :
                elem==="~" ? "lightgrey" :
                "lightgreen"
              }}
              onClick={() => handleAttack(rowIndex, colIndex, "player")}>
              {displayCell(elem,false)}
              </span>
          ))}
        </div>
      ))}

      {game.winner && (
        <h1 style={{
          color:"red",
          fontSize:"40px"
        }}>
          GAME OVER — {game.winner} WINS
        </h1>
      )}

    </div>
  );
}

export default App;