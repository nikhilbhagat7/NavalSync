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
    socket.join(roomId);
    console.log(`${playerName} joined room ${roomId}`);
    io.to(roomId).emit(
      "player-joined",{
        playerName,
        roomId
      }
    );
    //meta data
    socket.roomId = roomId;
    socket.playerName = playerName;
  })

  // Create room
  socket.on("create-room", ({ playerName }) => {
    const roomId = generateRoomId();
    rooms[roomId] = {
      players: [playerName],
      createdAt_ms: Date.now(),
      game: createGame()
    };
    socket.join(roomId);
    //meta data
    socket.roomId = roomId;
    socket.playerName = playerName;
    //testung
    console.log(`${socket.id} created room ${roomId}`);
    socket.emit("room-created", {roomId, playerName});
    console.log(`${playerName} joined room ${roomId}`);
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