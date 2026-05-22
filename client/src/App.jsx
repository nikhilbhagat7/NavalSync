// import { attack, isGameOver } from "./game/attack";
// import createBoard from "./game/board";
// import randomPlaceShips from "./game/placement";
// import ships from "./game/ships";
import createGame from "./game/gameManager";
import printBoard from "./utils/printer";

function App() {

  const game = createGame();


  return (
    <div style={{
      backgroundColor: "#015862",
      minHeight: "100vh",
      fontFamily: "sans-serif"
    }}>
      <h1>NavalSync</h1>
    </div>
  );
}

export default App;