const socket = io();
const slider = document.getElementById('slider');
let lastT = performance.now();
let lastP = Number(slider.value) / 1000;
let running = false;
let suppress = false;

socket.on('state', state => {
  running = state.running;
  suppress = true;
  slider.value = Math.round(state.position * 1000);
  lastP = state.position;
  lastT = performance.now();
  requestAnimationFrame(() => suppress = false);
});

slider.addEventListener("pointerdown", () => {
    slider.classList.add("sliding");
});

slider.addEventListener("pointerup", () => {
    slider.classList.remove("sliding");
});

slider.addEventListener('input', () => {
  if (suppress || !running) return;
  const now = performance.now();
  const p = Number(slider.value) / 1000;
  const dt = Math.max((now - lastT) / 1000, 0.001);
  const dp = p - lastP;
  const speed = Math.abs(dp) / dt;
  const direction = dp > 0 ? 1 : dp < 0 ? -1 : 0;
  lastP = p; lastT = now;
  socket.emit('slider', { position:p, speed, direction });
});
