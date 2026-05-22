// Ship Placement

const isValidPlacement = (board, row, col, ship_len, dir) => {
  const size = board.length;

  if (dir === "horizontal") {
    if (col + ship_len > size) 
      return false;
    for (let i = 0; i < ship_len; i++)
      if (board[row][col + i] !== "~") 
        return false;
  } else {
    if (row + ship_len > size) 
      return false;
    for (let i = 0; i < ship_len; i++)
      if (board[row + i][col] !== "~") 
        return false;
  }
  return true;
};

const randomPlaceShips = (board, ships) => {
  for (const ship of ships) {
    let placed = false;

    while (!placed) {
      const row = Math.floor(Math.random() * board.length);
      const col = Math.floor(Math.random() * board.length);
      const direction = Math.random() < 0.5 ? "horizontal" : "vertical";

      if (isValidPlacement(board, row, col, ship.length, direction)) {
        for (let i = 0; i < ship.length; i++)
          direction === "horizontal"
            ? board[row][col + i] = ship.symbol
            : board[row + i][col] = ship.symbol;
        placed = true;
      }
    }
  }
};

export default randomPlaceShips;