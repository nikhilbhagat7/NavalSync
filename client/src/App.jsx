// import { attack, isGameOver } from "./game/attack";
// import createBoard from "./game/board";
// import randomPlaceShips from "./game/placement";
// import ships from "./game/ships";
// import printBoard from "./utils/printer"; 
import createGame from "./game/gameManager";
import GameScreen from "./components/GameScreen"
import { useState } from 'react';

function App() {
  return <GameScreen/>;
}

export default App;