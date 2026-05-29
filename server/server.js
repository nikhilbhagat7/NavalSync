const express  = require("express");
const createGame = require("../client/src/game/gameManager.js").default;
const http = require("http");
const {Server} = require("socket.io");

const app = express();
const PORT = 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET","POST"]
  }
});

io.on("connection", (socket) => {

  // on connection
  console.log("New socket connected : ", socket.id);

  // when disconenct
  socket.on("disconnect", ()=>{
    console.log("socket disconnected:", socket.id);
    //get the meta data of socket
    const roomId = socket.roomId;
    const playerName = socket.playerName;
    //for already del room
    if(!rooms[roomId])
      return;
    //is not then remove it
    if(rooms[roomId]){
      rooms[roomId].players = rooms[roomId].players.filter(
        player => player !== playerName
      );

      io.to(roomId).emit(
        "player-disconnected",
        {
          playerName,
          roomId
        }
      );
    }
    console.log(rooms[roomId]); //for debugging
  });

  // Join room
  socket.on("join-room", ({roomId, playerName}) => {
    if(!rooms[roomId]){  //room exists?
      return socket.emit(
        "join-error",
        "room not found"
      );
    }
    if(rooms[roomId].players.length >= 2){ // full? 0 and 1 filled
      return socket.emit(
        "join-error",
        "room-full"
      );
    }
    rooms[roomId].players.push(playerName);
    rooms[roomId].gameStarted = true; //declare the game has started and players free to click now
    socket.join(roomId);
    console.log(`${playerName} joined room ${roomId}`);
    //meta data
    socket.role = "player2";  // Opponent/who joins the room
    socket.roomId = roomId;
    socket.playerName = playerName;
    //emit player-joined
    io.to(roomId).emit(
      "player-joined",{
        playerName,
        roomId,
        role:socket.role
      }
    );
    //emit game-start
    io.to(roomId).emit(
      "game-start",
      {
        roomId,
        status:"game started"
      }
    );
  })

  // Create room
  socket.on("create-room", ({ playerName }) => {
    // const roomId = generateRoomId();
    const roomId = "TEST321";
    rooms[roomId] = {
      players: [playerName],
      createdAt_ms: Date.now(),
      game: createGame(),
      gameStarted:false //helps in blocking clicks before game actually starts
    };
    socket.join(roomId);
    //meta data
    socket.role = "player1";  // Host/room creator
    socket.roomId = roomId;
    socket.playerName = playerName;
    //testung
    console.log(`${socket.id} created room ${roomId}`);
    console.log(`${playerName} joined room ${roomId}`);
    //emit
    socket.emit(
      "room-created", 
      {
        roomId, 
        playerName,
        role:socket.role
      }
    );
  })

  // attack event
  socket.on("attack", ({row,col}) => {
    const roomId = socket.roomId;
    const playerName = socket.playerName;
    const role = socket.role;
    //missing metadata edge case
    if(!roomId || !playerName){ 
      return console.log("missing socket metadata");
    }
    //room doesnt exist
    if(!rooms[roomId]){ 
      console.log("room missing");
      return;
    }
    //block attack before start
    if(!rooms[roomId].gameStarted){
      console.log("game not started");
      return;
    }
    //handle wrong player moves (spam clicking)
    const game = rooms[roomId].game;
    if(role !== game.currentTurn){
      console.log("wrong player turn");
      return;
    }
    //player belong to same room?
    if(!rooms[roomId].players.includes(playerName)){  
      console.log("invalid player");
      return;
    }
    //game over? validation
    if(rooms[roomId].game.winner){
      console.log("game already over");
      return;
    }
    //validate row/col
    if(row === undefined || col === undefined){
      console.log("invalid coords");
      return;
    }
    const result = game.playTurn(row,col);
    // payload
    const payload = { //broadcast all info at once for frontend to update
      player1board:game.player1.board,
      player2board:game.player2.board,
      row,
      col,
      result,
      currentTurn: game.currentTurn,
      status: game.status,
      winner: game.winner
    };
    io.to(roomId).emit("attack-result", payload);
    if(game.winner){
      io.to(roomId).emit ( "game-over", {
          winner: game.winner,
          status: game.status
        }
      );
    }
    //for debugginh
    console.log(`${playerName} attacking (${row},${col})`);
    console.log("result: ", result);
    console.log("status: ", game.status);
    console.log("payload: ", payload);
  })
});

//server memory to store game data
const rooms = {}; //not react state actually

app.get("/ping", (req,res) => {
  res.json({
    message: "pong"
  });
});

app.use(express.json());
app.post("/echo", (req,res) => {
  const data = req.body;
  res.json({
    received: data
  });
});

//create rooms
const generateRoomId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let roomId = "";
  for(let i=0; i<4; i++){ // room id of length 4 with random alphabet/numbers
    const randomIndex =
      Math.floor(Math.random() * chars.length);
    roomId += chars[randomIndex];
  }
  if (rooms[roomId]) {  // in case of duplicate room generation
    return generateRoomId();
  }
  return roomId;
};

app.post("/create-room", (req,res) => {
  const roomId = generateRoomId();
  rooms[roomId] = {
    players:[],
    createdAt_ms: Date.now(),// track the time of creation
    game: createGame()
  };
  res.json({
    message:`room (${roomId}) created, check at /rooms`
  })
});
//temp debugging
app.get("/room/:roomId/status", (req,res) =>{
  const roomId = req.params.roomId;
  if(!rooms[roomId])
    return res.status(404).json({
      error:"room not found!"
    });
  res.json(rooms[roomId].game.status);
})

//join room
app.post("/join-room", (req,res) => {
  const roomId = req.body.roomId;
  const playerName = req.body.playerName;
  // validate room exists
  if(!rooms[roomId]){
    return res.status(404).json({
      error:"room not found"
    });
  } 
  // validate max 2 players
  if(rooms[roomId].players.length >= 2){
    return res.status(400).json({
      error:"room full"
    });
  }
  // add player
  rooms[roomId].players.push(playerName);
  // respond
  res.json({
    message: `${playerName} joined room ${roomId}`,
    room: rooms[roomId]
  });
});

//see rooms
app.get("/rooms", (req,res) => {
  res.json(rooms)
});

app.get("/health", (req,res) => {
  res.json({
    status: "server alive :)"
  });
});

server.listen(PORT, () => {
  console.log(`server runs on port ${PORT}`);
});