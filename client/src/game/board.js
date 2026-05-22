// BOARD SYMBOLS :-
// ~ = means No ship there
// C/B/R/S/D = represent differenct ships
// X = successful hit
// O = miss

// Board creation
const createBoard = (size) => {
  const board = [];
  for(let i=0; i<size; i++){
    const cur_row = [];
    for(let j=0; j<size; j++){
      cur_row.push("~");
    }
    board.push(cur_row);
  }
  return board;
}


// Ship types
const ships = [
  { name:"Carrier", length:5, health:5, symbol:"C" },
  { name:"Battleship", length:4, health:4, symbol:"B" },
  { name:"Cruiser", length:3, health:3, symbol:"R" },
  { name:"Submarine", length:3, health:3, symbol:"S" },
  { name:"Destroyer", length:2, health:2, symbol:"D" }
];


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

const randomPlaceShips = board => {
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

// Attack function
const attack = (board, row, col, ships) => {
  //check if already missed or hit
  if(board[row][col]==="X" || board[row][col]==="O")
    return "ALREADY ATTACKED";
  //miss
  if(board[row][col]==="~"){
    board[row][col] = "O";
    return "MISS";
  }
  //hit
  else{
    const symbol = board[row][col];
    //update the ship health
    let hitShip;
    for( let ship of ships){
      if( ship.symbol === symbol){
        hitShip = ship;
        break;
      }
    }
    hitShip.health--;
    //mark X
    board[row][col] = "X";
    if(hitShip.health===0)
      return `${hitShip.name} SUNK`;
    else
      return "HIT";
  }
}

// game over check
const isGameOver = (ships) => {
  for(let ship of ships)
    if(ship.health>0)
      return false;
  return true;
}

// module.exports = { 
//   createBoard, 
//   randomPlaceShips, 
//   attack, 
//   ships, 
//   isGameOver 
// };

export {
  createBoard,
  randomPlaceShips,
  attack,
  ships,
  isGameOver
};