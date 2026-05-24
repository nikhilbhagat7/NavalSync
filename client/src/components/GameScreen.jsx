import Navbar from "./Navbar";
import StatusBar from "./StatusBar";
import BoardGrid from "./BoardGrid";
import ChatPanel from "./ChatPanel";

const GameScreen = () => {

  const playerBoard = [
    ["~","~","X"],
    ["C","O","~"],
    ["~","~","~"]
  ];

  const opponentBoard = [
    ["~","O","~"],
    ["~","X","~"],
    ["~","~","~"]
  ];

  return(
    <>
      <Navbar />
      <StatusBar />
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
          <BoardGrid title="PLAYER BOARD" board={playerBoard}/>
          <BoardGrid title="OPPONENT BOARD" board={opponentBoard}/>
        </div>
        <ChatPanel />
      </main>
    </>
  )
};

export default GameScreen;