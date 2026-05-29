import createGame from "./game/gameManager";
import GameScreen from "./components/GameScreen"
import './App.css';
import socket from "./socket";
import { useEffect, useState } from "react";

window.socket = socket; //for testing through browser console

function App() {

  const [myRole, setMyRole] = useState(null);

  useEffect(() => {
    // response to socket connection
    socket.on("connect", () => {
      console.log(`client ${socket.id} connected to server`);
      return ()=>{  //avoid duplicate listener
        socket.off("connect");
      };
    });

    // response to new room creation 
    socket.on("room-created",(data)=>{
      console.log("created:", data.roomId);
      console.log(
        `${data.playerName} joined ${data.roomId} as ${data.role}`
      );
      setMyRole(data.role);
      return ()=>{  //avoid duplicate listener
        socket.off("room-created");
      };
    });

    //response to a player joining 
    socket.on("player-joined", (data)=>{
      console.log(
        `${data.playerName} joined ${data.roomId} as ${data.role}`
      );
      //IMP EDGE CASE: when player2 joins server broadcasts player-joined.. player1 state myRole gets overwritten to player2
      setMyRole(cur =>{
        if (cur !== null){
          return cur;       // cur:player1 already has player1 keep it
        } 
        else{
          return data.role;  // player2 has null set it
        }
      });
      return ()=>{  //avoid duplicate listener
        socket.off("player-joined");
      };
    });

    //response to game start - broadcase it
    socket.on("game-start",(data)=>{
      console.log(data.status);
    });

    //respnse to disconnected socket
    socket.on("player-disconnected",(data) => {
      console.log(`${data.playerName} disconnected from ${data.roomId}`);
      return ()=>{  //avoid duplicate listener
        socket.off("player-disconnected");
      };
    });

    //resp to receiving game-result
    // socket.on("attack-result", (data) => {
    //   console.log("ATTACK RESULT:",data);
    //   return ()=>{  //avoid duplicate listener
    //     socket.off("attack-result");
    //   };
    // })

  }, []);

  return <GameScreen myRole={myRole}/>

}

export default App;


////TESTING CODE
// socket.emit("create-room", {
//   playerName: "Host"
// })
// socket.emit("join-room", {
//   roomId: "F45Q",
//   playerName: "Player2"
// })