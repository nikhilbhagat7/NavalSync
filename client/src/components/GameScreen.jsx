import Navbar from "./Navbar";
import StatusBar from "./StatusBar";
import BoardGrid from "./BoardGrid";
import ChatPanel from "./ChatPanel";
import createGame from "../game/gameManager";
import { useState } from "react";
import socket from "../socket";

const GameScreen = () => {

  const [game] = useState(() => createGame());

  const playerBoard = game.player1.board;
  const opponentBoard = game.player2.board;

  const [, forceRender] = useState(0);
  const handleAttack = (row, col, boardClicked) => {
    console.log(`BEFORE : ${game.status}`)
    if (game.winner) return;
    if (game.currentTurn === "player1" && boardClicked !== "opponent") return;
    if (game.currentTurn === "player2") return; 
    // if (game.currentTurn === "player2" && boardClicked !== "player") return; //for Player vs Player

    // const result = game.playTurn(row, col);  //relaced with socket emit
    // if(result === "already attacked") return;
    socket.emit("attack", {row,col});

    //// Player vs Dumb Bot :( jsut for now
    // if (!game.winner && game.currentTurn === "player2") 
    // {
    //   setTimeout(() => {
    //     botAttack(row, col);
    //   }, 500);
    // }

    // forceRender(n => n + 1); // just triggers re-render
    // ^ edge case like: "hit" followed by another "hit" where setLastResult(result) the second time does nothing as react renders when state changes not to any change in variables
    console.log(`AFTER : ${game.status}`)
  };

  //basic bot to play agiant player
  const botAttack = (row, col) => {
    if (game.winner) return;

    let result = "already attacked";
    while(result === "already attacked"){
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      result = game.playTurn(row, col);
    }

    forceRender(n => n+1);// just triggers re-render
    console.log(`BOT MAKES MOVE`);
  }

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
            isOpponentBoard={true}
          />
          <BoardGrid 
            title="PLAYER BOARD - P2" 
            board={playerBoard} 
            onCellClick={(row,col)=>handleAttack(row,col,"player")}    // no bot
            isOpponentBoard={false}
          />
        </div>
        <ChatPanel />
      </main>
    </>
  )
};

export default GameScreen;