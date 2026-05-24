const BoardGrid = ({ title, board}) => {

  // const cellStyle = (cell) => {
  //   background:
  //     cell === "X" ? "red" :
  //     cell === "O" ? "gray" :
  //     cell === "~" ? "blue" :
  //     "green"
  // };
  return (
    <section>
      <h3>{title}</h3>
        {board.map((row, rowIndex) => (
          <div id={rowIndex}>
            {row.map((elem, colIndex) => (
              <span 
              key={colIndex}
              style={{
                border:"1px solid white",
                padding:"10px",
                display:"inline-block",
                width:"20px",
                textAlign:"center",
                background:
                  elem === "X" ? "red" :
                  elem === "O" ? "gray" :
                  elem === "~" ? "blue" :
                  "green"
              }}>
                {elem}
              </span>
            ))}
          </div>
        ))}
    </section>
  );
};

export default BoardGrid;