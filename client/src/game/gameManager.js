import createBoard from "./board";
import randomPlaceShips from "./placement";
import ships from "./ships";
import {attack, isGameOver} from "./attack";

// Turn Controller
const createGame = () => {
  //Need 2 boards for player and opponent
  const player1Board = createBoard(10);
  const player2Board = createBoard(10);
  //Seperate ship sets
  const player1Ships = structuredClone(ships);
  const player2Ships = structuredClone(ships);
  //Place ships random 
  randomPlaceShips(player1Board, player1Ships);
  randomPlaceShips(player2Board, player2Ships);
  //enter match state
  const game = {
    player1: {
      board: player1Board,
      ships: player1Ships,
    },
    player2: {
      board: player2Board,
      ships: player2Ships,
    },

    currentTurn: "player1",
    winner: null,
    status: "waiting for player1 move"
    }
    //player attack fn
    game.playerAttack = (row, col) => {
      if(game.currentTurn!=="player1"){
        return "not player1 turn";
      }

      const result = attack(
        game.player2.board,
        row,
        col,
        game.player2.ships
      );

      if (isGameOver(game.player2.ships)) {
        game.winner = "player1";
        game.status = "game over";
        return result;
      }
      if(result==="already attacked") return result;

      game.currentTurn = "player2";
      game.status = "waiting for player2 move"; 
      return result;
    }
    //opponent attack fn
    game.opponentAttack = (row, col) => {
      if(game.currentTurn!=="player2"){
        return "not player2 turn";
      }

      const result = attack(
        game.player1.board,
        row,
        col,
        game.player1.ships
      );
      if(result==="already attacked") return result;

      if (isGameOver(game.player1.ships)) {
        game.winner = "player2";
        game.status = "game over";
        return result;
      }

      game.currentTurn = "player1";
      game.status = "waiting for player1 move"; 
      return result;
    };
    //turn managing fn
    game.playTurn = (row, col) => {
      if(game.winner) //null if not set
        return "GAME ALREADY OVER";
      
      if(game.currentTurn==="player1")
        return game.playerAttack(row,col);
      else
        return game.opponentAttack(row,col);
    }
  return game;

};

export default createGame;