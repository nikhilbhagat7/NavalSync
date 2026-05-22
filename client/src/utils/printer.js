const printBoard = (board) => {
  for( const rows of board){
      console.log(rows.join(" "));
  }
}

// module.exports = printBoard
export default printBoard;