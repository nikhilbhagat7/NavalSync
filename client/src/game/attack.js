// Attack function
const attack = (board, row, col, ships) => {
  //check if already missed or hit
  if(board[row][col]==="X" || board[row][col]==="O")
    return "already attacked";
  //miss
  if(board[row][col]==="~"){
    board[row][col] = "O";
    return "miss";
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
    //if a ship sinks
    if(hitShip.health===0)
      return `${hitShip.name} SUNK`;
    else
      return "hit";
  }
}
// game over check
const isGameOver = (ships) => {
  for(let ship of ships)
    if(ship.health>0)
      return false;
  return true;
}

export {attack, isGameOver};