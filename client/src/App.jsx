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

function App() {

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`client ${socket.id} connected to server`);
    });
    //send res
    socket.emit("hello-server", {
      user: "Nikhil",
      text: "hi backend"
    });
    //rec res
    socket.on("welcome-client", (data) => {
      console.log("backend replied:", data);
    });
  }, []);

  return <GameScreen/>; 
}

export default App;