const socket = io(); 

const continueButton = document.getElementById("continue");

continueButton.onclick = () => {
    socket.emit('checkpointReached');
    window.location.href='/slider'
};