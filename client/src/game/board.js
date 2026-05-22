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

export default createBoard;