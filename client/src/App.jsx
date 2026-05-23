// import { attack, isGameOver } from "./game/attack";
// import createBoard from "./game/board";
// import randomPlaceShips from "./game/placement";
// import ships from "./game/ships";
import createGame from "./game/gameManager";
import printBoard from "./utils/printer"; 
import { useState } from 'react';

function App() {

  const [game,setGame] = useState(createGame());
  console.log(game.player1.board);

  //temp funct just for noww
  const displayCell = (cell, hideShip) => {
    if(hideShip && ["C","B","R","S","D"].includes(cell))
      return "~";
    return cell;
  }

  const tableStyle = {
    display: "inline-block",
    width: "30px",
    height: "30px",
    border: "1px solid black",
    textAlign: "center",
    lineHeight: "30px"
  };

  const [lastResult, setLastResult] = useState("");
  const handleAttack = (row, col) => {
    console.log(game.status);
    const result = game.playTurn(row, col);
    console.log("Result:", result);
    console.log("After:", game.status);
    setLastResult(result);
    setGame({...game});
  }


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
                  "lightgrey"}}
                onClick={() => {handleAttack(rowIndex,colIndex)}}>
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
              onClick={() => {handleAttack(rowIndex,colIndex)}}>
              {displayCell(elem,false)}
              </span>
          ))}
        </div>
      ))}

    </div>
  );
}

export default App;