import Navbar from "./Navbar";
import StatusBar from "./StatusBar";
import BoardGrid from "./BoardGrid";
import ChatPanel from "./ChatPanel";
import createGame from "../game/gameManager";
import { useState, useEffect } from "react";
import socket from "../socket";

const GameScreen = ({myRole}) => {

  const [game] = useState(() => createGame());

  const [serverGame,setServerGame] = useState(null);
  useEffect(() => {
    socket.on("attack-result", (data) => {
      console.log(data);
      setServerGame(data);
    });
    //game over handling
    socket.on("game-over", (data)=>{
        console.log("GAME OVER:", data);
      }
    );
    return () => {
      socket.off("attack-result");
      socket.off("game-over");
    };
  }, []);

  const myTurn = serverGame?.currentTurn === myRole;
  const playerBoard =
    myRole === "player1"
      ? serverGame?.player1board ||
        game.player1.board
      : serverGame?.player2board ||
        game.player2.board;
  const opponentBoard =
    myRole === "player1"
      ? serverGame?.player2board ||
        game.player2.board
      : serverGame?.player1board ||
        game.player1.board;

  // const playerBoard = game.player1.board;
  // const opponentBoard = game.player2.board;
  // const playerBoard = game.player1.board;
  // const opponentBoard = game.player2.board;

  const [, forceRender] = useState(0);
  const handleAttack = (row, col, boardClicked) => {
    console.log(`BEFORE : ${serverGame.status}`)
    if (game.winner) return;
    if(serverGame?.winner)
      return;
    // if (game.currentTurn === "player1" && boardClicked !== "opponent") return;
    // if (game.currentTurn === "player2") return; 
    
    //IMP EDGE CASE: handle spam clicks
    if (boardClicked !== "opponent")
      return;

    const currentTurn =  serverGame?.currentTurn;
    // serverGame to dodge
    if (serverGame && currentTurn !== myRole)
      return;

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
    console.log(`AFTER : ${serverGame.status}`)
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
      { serverGame?.winner && (
          <div>
            GAME OVER
            <br/>
            Winner:
            {serverGame.winner}
          </div>
        )}
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
            title="OPPONENT BOARD" 
            board={opponentBoard} 
            onCellClick={(row,col)=>handleAttack(row,col,"opponent")}
            isOpponentBoard={true}
          />
          <BoardGrid 
            title="YOUR BOARD" 
            board={playerBoard} 
            onCellClick={(row,col)=>handleAttack(row,col,"player")}    // no bot
            isOpponentBoard={false}
          />
        </div>
        <ChatPanel />
      </main>

      <div>
       {serverGame && (
        <div>
          TURN: {serverGame.currentTurn}
          STATUS: {serverGame.status}
          RESULT: {serverGame.result} 
          <br/>
          ROLE: {myRole}
          <br/>
          {myTurn
            ? "YOUR TURN"
            : "OPPONENT TURN"}
        </div>
       )}
      </div>

    </>
  )
};

export default GameScreen;