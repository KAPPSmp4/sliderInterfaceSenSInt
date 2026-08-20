const socket = io(); 

const newParticipantButton = document.getElementById("new-participant");
let newParticipantId = document.getElementById("participantId");

newParticipantButton.onclick = () => {
    let participantIdInput = newParticipantId.value;
    let finalParticipantId = Number(participantIdInput);
    socket.emit('newParticipant', finalParticipantId);
    window.location.href='/tutorial'
};