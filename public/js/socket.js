var socket = io();

var formElement = document.getElementById('form-name');
var nameElement = document.getElementById('my-name');
var myName = '';

formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  myName = nameElement.value;
});

var scoreRemote = document.getElementById('smile-score-remote');

var mySocketId = null;

socket.on('token', (data) => {
  mySocketId = data;
})

socket.on('chat message', (smileData) => {
  if (smileData.id !== mySocketId) {
    scoreRemote.innerHTML = `${smileData.name ? smileData.name : ''} 笑顔度: ${smileData.data}`;
    console.log(`${smileData.id}: ${smileData.data}`);
  }
});

function sendSmile(data) {
  const smileData = { id: mySocketId, name: myName ? myName : '', data: data };
  socket.emit("chat message", smileData);
}
