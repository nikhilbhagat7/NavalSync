import { createBoard, randomPlaceShips, attack, ships, isGameOver } from "./components/board";
import printBoard from "./utils/printer";


function App() {

  const board = createBoard(10);
  randomPlaceShips(board);
  printBoard(board);
  console.log(
    isGameOver(ships)
  );

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