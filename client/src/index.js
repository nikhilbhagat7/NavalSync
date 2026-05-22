const { createBoard, randomPlaceShips, attack, ships, isGameOver } = require("./components/board");
const printBoard = require("./utils/printer");

const board = createBoard(10);
randomPlaceShips(board);
attack(board,4,3,ships);
attack(board,4,4,ships);
attack(board,4,5,ships);
attack(board,4,6,ships);
attack(board,4,7,ships);
attack(board,4,8,ships);
attack(board,4,9,ships);
attack(board,4,0,ships);
attack(board,4,1,ships);
attack(board,4,2,ships);

console.log(isGameOver(ships));

printBoard(board);