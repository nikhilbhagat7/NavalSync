import Navbar from "./Navbar";
import StatusBar from "./StatusBar";
import BoardGrid from "./BoardGrid";
import ChatPanel from "./ChatPanel";
import createGame from "../game/gameManager";
import { useState } from "react";

const GameScreen = () => {

  const [game] = useState(() => createGame());

  const playerBoard = game.player1.board;
  const opponentBoard = game.player2.board;

  const [, forceRender] = useState(0);
  const handleAttack = (row, col, boardClicked) => {
    console.log(`BEFORE : ${game.status}`)
    if (game.winner) return;
    if (game.currentTurn === "player1" && boardClicked !== "opponent") return;
    if (game.currentTurn === "player2" && boardClicked !== "player") return;

    const result = game.playTurn(row, col);
    if (result === "already attacked") return;

    forceRender(n => n + 1); // just triggers re-render
    // ^ edge case like: "hit" followed by another "hit" where setLastResult(result) the second time does nothing
    console.log(`AFTER : ${game.status}`)
  };

  return(
    <>
      <Navbar />
      <StatusBar turn={game.currentTurn} status={game.status} winner={game.winner}/>
      <main style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start"
        }}>
        <div
          style={{
            display: "flex",
            gap: "20px"
          }}>
          <BoardGrid 
            title="OPPONENT BOARD - P1" 
            board={opponentBoard} 
            onCellClick={(row,col)=>handleAttack(row,col,"opponent")}
          />
          <BoardGrid 
            title="PLAYER BOARD - P2" 
            board={playerBoard} 
            onCellClick={(row,col)=>handleAttack(row,col,"player")}
          />
        </div>
        <ChatPanel />
      </main>
    </>
  )
};

export default GameScreen;