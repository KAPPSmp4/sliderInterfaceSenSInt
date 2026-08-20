const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let DATA_DIR = path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

// Variables
let currentParticipantId = 0;
let currentCSV = null;
let trialNumber = 0;

let sliderPosition = 0;
let nextFlag = false;
let resetFlag = false;

let movedFlag = false;
let motionless = 0;

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', socket => {
  console.log("a user connected");
  io.emit('trialChange', trialNumber);

  socket.on('newParticipant' , (newParticipant) => {
    currentParticipantId = newParticipant;
    let CSV = path.join(DATA_DIR, `Participant${currentParticipantId}.csv`);
    currentCSV = CSV;
    if (!fs.existsSync(CSV)) {
      fs.writeFileSync(
          CSV,
          "trialNumber,timestamp,position,speed,direction\n"
      );
}
  });

  socket.on('nextTrial' , (nextTrial) => {
    nextFlag = false;
    resetFlag = false;
    trialNumber++;
    io.emit('nextChange', nextFlag);
    io.emit('resetChange', resetFlag);
    io.emit('trialChange', trialNumber);
  });

  socket.on('requestReset' , (requestReset) => {
    resetFlag = true;
    io.emit('resetChange', resetFlag);
  });

  socket.on('reseted' , (reseted) => {
    resetFlag = false;
    io.emit('resetChange', resetFlag);
  });

  socket.on('requestNext' , (requestNext) => {
    nextFlag = true;
    io.emit('nextChange', nextFlag);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Slider experiment running at http://localhost:${PORT}`));
