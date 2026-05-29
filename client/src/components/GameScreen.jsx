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

  //Handle initial server component's null handling
  let renderGame;
  if(serverGame)
    renderGame = serverGame
  else{
    renderGame = {
      currentTurn: null,
      status: "waiting..",
      winner: null,
      player1board: game.player1.board, //dummy board
      player2board: game.player2.board  //dummy board
    };
  }

  const myTurn = renderGame.currentTurn === myRole;
  const playerBoard =
    myRole === "player1"
      ? renderGame.player1board
      : renderGame.player2board;
  const opponentBoard =
    myRole === "player1"
      ? renderGame.player2board
      : renderGame.player1board;

  // handle attacks
  const handleAttack = (row, col, boardClicked) => {
    if(serverGame?.winner)
      return;
    
    //IMP EDGE CASE: handle spam clicks
    if (boardClicked !== "opponent")
      return;

    const currentTurn =  serverGame?.currentTurn;
    // serverGame to dodge
    if (serverGame && currentTurn !== myRole)
      return;

    socket.emit("attack", {row,col});
  };

  return(
    <>
      <Navbar />
      <StatusBar 
        turn={renderGame.currentTurn} 
        status={renderGame.status} 
        winner={renderGame.winner}
      />
      { renderGame?.winner && (
          <div>
            GAME OVER
            <br/>
            Winner:
            {renderGame.winner}
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
       {renderGame && (
        <div>
          TURN: {renderGame.currentTurn}
          STATUS: {renderGame.status}
          RESULT: {renderGame.result} 
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