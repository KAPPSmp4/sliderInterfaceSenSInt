const socket = io("ws://localhost:3000");

const slider = document.getElementById('slider');
const trialDisplay = document.getElementById("trial-display");
const resetButton = document.getElementById("request-reset");
const nextButton = document.getElementById("request-next") ;

let lastTimestamp = performance.now();
let lastPosition = Number(slider.value) / 1000;
let running = false;
let suppress = false;

socket.on('trialChange' , (trialChange) => {
  trialDisplay.textContent = `Trial number: ${trialChange}`
});

resetButton.onclick = () => socket.emit('requestReset');
nextButton.onclick = () => socket.emit('requestNext');

slider.addEventListener('input', () => {
  if (suppress || !running) return;
  const now = performance.now();
  const position = Number(slider.value) / 1000;
  const dt = Math.max((now - lastTimestamp) / 1000, 0.001);
  const dp = position - lastPosition;
  const speed = Math.abs(dp) / dt;
  const direction = dp > 0 ? 1 : dp < 0 ? -1 : 0;
  lastPosition = p; lastTimestamp = now;
  socket.emit('slider', { position:p, speed, direction });
});

slider.addEventListener("pointerdown", () => {
    slider.classList.add("sliding");
});

slider.addEventListener("pointerup", () => {
    slider.classList.remove("sliding");
});