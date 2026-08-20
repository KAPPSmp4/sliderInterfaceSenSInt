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

// Variables
let currentParticipantId = 0;
let currentCSV = null;
let trialNumber = 0;

let sliderPosition = 0;
let nextFlag = false;
let resetFlag = false;

let movedFlag = false;
let motionless = 0;

let DATA_DIR = path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });
let startingCSV = path.join(DATA_DIR, `Participant${currentParticipantId}.csv`);
currentCSV = startingCSV;
if (!fs.existsSync(startingCSV)) {
  fs.writeFileSync(
    startingCSV,
    "trialNumber,timestamp,position,speed,direction\n"
  );
}

app.use(express.static(path.join(__dirname, '../public/views/homescreenView')));
app.use(express.static(path.join(__dirname, '../public/views/tutorialView')));
app.use(express.static(path.join(__dirname, '../public/views/sliderView')));
app.use(express.static(path.join(__dirname, '../public/views/intermissionView')));
app.use(express.static(path.join(__dirname, '../public/views/finishView')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/views/homescreenView/homescreen.html"));
});

app.get("/tutorial", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/views/tutorialView/tutorial.html"));
});

app.get("/slider", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/views/sliderView/slider.html"));
});

app.get("/intermission", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/views/intermissionView/intermission.html"));
});

app.get("/finish", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/views/finishView/finish.html"));
});

io.on('connection', socket => {
  console.log("a user connected");
  io.emit('trialChange', trialNumber);

  // Homescreen signals

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

  // Inter

  // Participant signals

  socket.on('sliderData' , (sliderData) => {
    console.log("Received:", sliderData);

    const row = [
      trialNumber,
      sliderData.timestamp,
      sliderData.position,
      sliderData.speed,
      sliderData.direction
    ];

    fs.appendFileSync(currentCSV,row.join(",") + "\n");
  });

  socket.on('nextTrial' , (nextTrial) => {
    trialNumber++;
    io.emit('trialChange', trialNumber);
  });

  socket.on('redo' , (redo) => {
    const data = fs.readFileSync(currentCSV, "utf8");

    let lines = data.split(/\r?\n/);

    // Remove empty line at the end
    if (lines[lines.length - 1] === "") {
      lines.pop();
    }

    while (lines.length > 0) {
      const rowTrialNumber = Number(lines[lines.length - 1].split(",")[0]);

      if (rowTrialNumber === trialNumber) {
        lines.pop();
      } else {
        break;
      }
    }

    fs.writeFileSync(currentCSV, lines.join("\n") + "\n");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`Slider experiment running at http://localhost:${PORT}`));
