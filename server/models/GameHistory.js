const mongoose = require("mongoose");

const gameHistory = new mongoose.Schema({
  players:[String],
  winner:String,
  playedAt:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model("GameHistory", gameHistory);