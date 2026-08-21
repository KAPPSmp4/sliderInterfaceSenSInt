const socket = io();

const slider = document.getElementById('slider');
const trialDisplay = document.getElementById("trial-display");
const resetButton = document.getElementById("redo-btn");
const nextButton = document.getElementById("nextTrial-btn") ;

let trialNumber = 1;
let checkpointTime = performance.now();
let firstPointerDown = false;
let lastTimestamp = performance.now();
let lastPosition = Number(slider.value) / 1000;

let logInterval = null;

socket.on('trialChange' , (trialChange) => {
  trialNumber = trialChange;
  firstPointerDown = false;
  slider.classList.remove("sliding");
  trialDisplay.textContent = `Trial number: ${trialNumber}`
});

socket.on('enableButton' , (trialChange) => {
  slider.classList.remove("sliding");
  slider.disabled = false;
  nextButton.disabled = false;
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
  nextButton.disabled = true;
  slider.disabled = true;
  if (trialNumber + 1 == 33 || trialNumber + 1 == 65 || trialNumber + 1 == 97) {
      window.location.href='/intermission'
  }
  if (trialNumber + 1 == 129) {
      window.location.href='/finish'
  }
  socket.emit('nextTrial');
};

slider.addEventListener('input', () => {
  logSlider();
});

slider.addEventListener("pointerdown", () => {
  if (!firstPointerDown) {
    firstPointerDown = true;
    checkpointTime = performance.now();
  }
  slider.classList.add("sliding");
});

slider.addEventListener('pointerup', () => {
  logInterval = null;
});

function logSlider() {
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
}