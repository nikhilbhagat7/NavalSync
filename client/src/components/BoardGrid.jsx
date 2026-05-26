const BoardGrid = ({ title, board, onCellClick, isOpponentBoard}) => {

  const shipSymbols = ["C","B","S","R","D"];

  return (

    <section>
      <h3>{title}</h3>
        {board.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((elem, colIndex) => {

              const isShip = shipSymbols.includes(elem);
              const isWater = (elem==="~");
              let displayValue;
              if(isOpponentBoard && (isShip||isWater))
                displayValue = "?"
              else
                displayValue = elem;

              return(
                <span 
                onClick = {() => onCellClick(rowIndex, colIndex)}
                key={colIndex}
                style={{
                  border:"1px solid white",
                  padding:"10px",
                  display:"inline-block",
                  width:"20px",
                  textAlign:"center",
                  background:
                    displayValue === "X" ? "rgb(255, 81, 46)" :
                    displayValue === "O" ? "#2f8bdc" :
                    displayValue === "~" ? "#3846e2" :
                    displayValue === "?" ? "#c0bd26" :
                    "green"
                }}>
                  {displayValue}
                </span>
              )
            })}
          </div>
        ))}
    </section>
  );
};

export default BoardGrid;