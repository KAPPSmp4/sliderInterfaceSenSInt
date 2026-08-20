const socket = io(); 

const trialDisplay = document.getElementById("trial-display");
const nextDisplay = document.getElementById("next-display");
const resetDisplay = document.getElementById("reset-display");
const newParticipantButton = document.getElementById("new-participant");
let newParticipantId = document.getElementById("participantId");
const resetButton = document.getElementById("reset");
const nextButton = document.getElementById("next-trial");
const sliderPosition = document.getElementById("participantMarker");

socket.on('trialChange' , (trialChange) => {
  trialDisplay.textContent = `Trial number: ${trialChange}`
});

socket.on('resetChange' , (resetChange) => {
  resetDisplay.textContent = `Reset: ${resetChange}`
});

socket.on('nextChange' , (nextChange) => {
  nextDisplay.textContent = `Next: ${nextChange}`
});

socket.on('sliderChange' , (sliderChange) => {
  console.log("receiving slider data")
  sliderPosition.style.left = `${sliderChange}%`
});

newParticipantButton.onclick = () => {
    let participantIdInput = newParticipantId.value;
    let finalParticipantId = Number(participantIdInput);
    console.log(finalParticipantId);
    socket.emit('newParticipant', finalParticipantId);
};

nextButton.onclick = () => socket.emit('nextTrial');

resetButton.onclick = () => socket.emit('reseted');
    
