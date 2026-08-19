const socket = io(); 
const pid = document.getElementById('pid'), status=document.getElementById('status'), dot=document.getElementById('dot');
socket.on('state', s=>{pid.textContent=s.participantId;status.textContent=s.running?'Running':'Waiting';
    dot.style.left=`${s.position*100}%`;});
document.getElementById('continue').onclick=()=>socket.emit('continue');
document.getElementById('reset').onclick=()=>socket.emit('reset');
document.getElementById('new').onclick=()=>{if(confirm('Start a new participant?')) socket.emit('newParticipant');};
