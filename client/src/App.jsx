// import { attack, isGameOver } from "./game/attack";
// import createBoard from "./game/board";
// import randomPlaceShips from "./game/placement";
// import ships from "./game/ships";
// import printBoard from "./utils/printer"; 
import createGame from "./game/gameManager";
import GameScreen from "./components/GameScreen"
import './App.css';
import socket from "./socket";
import { useEffect } from "react";

window.socket = socket; //for testing through browser console

function App() {

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`client ${socket.id} connected to server`);
      return ()=>{  //avoid duplicate listener
        socket.off("connect");
      };
    });

    //create-room
    // socket.emit("create-room");

    //join-room
    // socket.emit("join-room",{
    //   roomId:"AB12",
    //   playerName:"Name_Joiner"
    // });]

    // response to new room creation 
    socket.on("room-created",({roomId, playerName})=>{
      console.log("created:", roomId);
      console.log(`${playerName} joined room ${roomId}`);
      return ()=>{  //avoid duplicate listener
        socket.off("room-created");
      };
    });
    //response to a player joining 
    socket.on("player-joined", (data)=>{
      console.log(`${data.playerName} joined ${data.roomId}`);
      return ()=>{  //avoid duplicate listener
        socket.off("player-joined");
      };
    });
    //respnse to disconnected player
    socket.on("player-disconnected",(data) => {
      console.log(`${data.playerName} disconnected from ${data.roomId}`);
      return ()=>{  //avoid duplicate listener
        socket.off("player-disconnected");
      };
    });
    //resp to receiving game-result
    socket.on("attack-result", (data) => {
      console.log("ATTACK RESULT:",data);
      return ()=>{  //avoid duplicate listener
        socket.off("attack-result");
      };
    })

    ////TESTING CODE
    // socket.emit("create-room", {
    //   playerName: "Host"
    // })
    // socket.emit("join-room", {
    //   roomId: "F45Q",
    //   playerName: "Player2"
    // })

  }, []);

  return <GameScreen/>; 
}

export default App;