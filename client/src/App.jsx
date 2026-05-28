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
    });
    //response to a player joining 
    socket.on("player-joined", (data)=>{
      console.log(`${data.playerName} joined ${data.roomId}`);
    });
    //respnse to disconnected player
    socket.on(
      "player-disconnected",
      (data) => {
        console.log(`${data.playerName} disconnected from ${data.roomId}`);
      }
    );
  }, []);

  return <GameScreen/>; 
}

export default App;