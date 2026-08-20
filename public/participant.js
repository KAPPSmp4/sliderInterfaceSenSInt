const socket = io("ws://localhost:3000");

const slider = document.getElementById('slider');
const trialDisplay = document.getElementById("trial-display");
const resetButton = document.getElementById("request-reset");
const nextButton = document.getElementById("request-next") ;

let participantStartTime = performance.now();
let lastTimestamp = performance.now();
let lastPosition = Number(slider.value) / 1000;

socket.on('trialChange' , (trialChange) => {
  trialDisplay.textContent = `Trial number: ${trialChange}`
});

resetButton.onclick = () => socket.emit('requestReset');
nextButton.onclick = () => socket.emit('requestNext');

slider.addEventListener('input', () => {
  const now = performance.now();
  const position = Number(slider.value) / 1000;
  const dt = Math.max((now - lastTimestamp) / 1000, 0.001);
  const dp = position - lastPosition;
  const speed = Math.abs(dp) / dt;
  const direction = position > lastPosition ? 1 : position < lastPosition ? -1 : 0;

  const sliderData = {
    timestamp: now,
    position: position,
    speed: speed,
    direction: direction
  }

  socket.emit('sliderData', sliderData);

  lastPosition = position; 
  lastTimestamp = now;
});

slider.addEventListener("pointerdown", () => {
    slider.classList.add("sliding");
});

slider.addEventListener("pointerup", () => {
    slider.classList.remove("sliding");
});