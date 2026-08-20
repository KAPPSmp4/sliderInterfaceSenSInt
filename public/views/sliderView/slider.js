const socket = io();

const slider = document.getElementById('slider');
const trialDisplay = document.getElementById("trial-display");
const resetButton = document.getElementById("redo-btn");
const nextButton = document.getElementById("nextTrial-btn") ;

let trialNumber = 0;
let checkpointTime = performance.now();
let lastTimestamp = performance.now();
let lastPosition = Number(slider.value) / 1000;

socket.on('trialChange' , (trialChange) => {
  trialNumber = trialChange;
  trialDisplay.textContent = `Trial number: ${trialChange}`
});

socket.on('checkpointReached' , (checkpointReached) => {
  checkpointTime = performance.now();
});

resetButton.onclick = () => {
  if (trialNumber + 1 == 33 || trialNumber + 1 == 65 || trialNumber + 1 == 97) {
      window.location.href='/intermission'
  }
  if (trialNumber + 1 == 129) {
      window.location.href='/finsish'
  }
  socket.emit('redo');
};

nextButton.onclick = () => {
  if (trialNumber + 1 == 33 || trialNumber + 1 == 65 || trialNumber + 1 == 97) {
      window.location.href='/intermission'
  }
  if (trialNumber + 1 == 129) {
      window.location.href='/finish'
  }
  socket.emit('nextTrial');
};

slider.addEventListener('input', () => {
  const now = performance.now() - checkpointTime;
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