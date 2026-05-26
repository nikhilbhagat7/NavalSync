const express  = require("express");

const app = express();

const PORT = 3000;

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
    createdAt_ms: Date.now() // track the time of creation
  };
  res.json({
    message:"room created, check at /rooms"
  })
});

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

app.listen(PORT, () => {
  console.log(`server runs on port ${PORT}`);
});