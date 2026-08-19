const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const DATA_DIR = path.join(__dirname, 'data');
const CSV = path.join(DATA_DIR, 'experiment.csv');
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(CSV)) fs.writeFileSync(CSV, 'participant_id,timestamp_ms,position,speed,direction,event\n');

let participantNumber = 1;
let state = { participantId: `P${String(participantNumber).padStart(3,'0')}`, position: 0.5, running: false };

function broadcastState() { io.emit('state', state); }
function logRow(row) { fs.appendFile(CSV, row.map(v => String(v).replaceAll(',', ';')).join(',') + '\n', err => { if (err) console.error(err); }); }

app.use(express.static(path.join(__dirname, 'public')));
app.get('/download', (req,res) => res.download(CSV, 'experiment.csv'));

io.on('connection', socket => {
  socket.emit('state', state);

  socket.on('slider', d => {
    if (!state.running) return;
    if (!d || !Number.isFinite(d.position) || !Number.isFinite(d.speed)) return;
    state.position = Math.max(0, Math.min(1, d.position));
    const direction = d.direction === -1 ? 'left' : d.direction === 1 ? 'right' : 'none';
    logRow([state.participantId, Date.now(), state.position, d.speed, direction, 'move']);
    socket.broadcast.emit('state', state);
  });

  socket.on('continue', () => { state.running = true; broadcastState(); });
  socket.on('reset', () => { state.position = 0.5; state.running = false; logRow([state.participantId, Date.now(), state.position, 0, 'none', 'reset']); broadcastState(); });
  socket.on('newParticipant', () => {
    participantNumber++;
    state = { participantId: `P${String(participantNumber).padStart(3,'0')}`, position: 0.5, running: false };
    logRow([state.participantId, Date.now(), state.position, 0, 'none', 'new_participant']);
    broadcastState();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Slider experiment running at http://localhost:${PORT}`));
