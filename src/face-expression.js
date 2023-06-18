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

const FACE = {};

FACE.EXPRESSION = () => {
  const cameraArea = document.getElementById('cameraArea'),
    camera = document.getElementById('camera'),
    canvas = document.getElementById('canvas'),
    score = document.getElementById('smile-score'),
    emoticon = document.getElementById('emoticon'),
    ctx = canvas.getContext('2d'),
    canvasW = 640,
    canvasH = 480,
    intervalTime = 500,
    emoticonTxt = [':)',':|'];

  const init = async () => {
    setCanvas();
    setCamera();
    await faceapi.nets.tinyFaceDetector.load("./weights/");
    await faceapi.nets.faceExpressionNet.load("./weights/");
  },

  setCanvas = () => {
    canvas.width = canvasW;
    canvas.height = canvasH;
  },

  setCamera = async () => {
    var constraints = {
      audio: false,
      video: {
        width: canvasW,
        height: canvasH,
        facingMode: 'user'
      }
    };
    await navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      camera.srcObject = stream;
      camera.onloadedmetadata = (e) => {
        playCamera();
      };
    })
    .catch((err) => {
      console.log(err.name + ': ' + err.message);
    });
  },

  playCamera = () => {
    camera.play();
    setInterval(async () => {
      canvas.getContext('2d').clearRect(0, 0, canvasW, canvasH);
      checkFace();
    }, intervalTime);
  },

  checkFace = async () => {
    let faceData = await faceapi.detectAllFaces(
      camera, new faceapi.TinyFaceDetectorOptions()
    ).withFaceExpressions();
    if(faceData.length){
      const setDetection = () => {
        let box = faceData[0].detection.box;
          x = box.x,
          y = box.y,
          w = box.width,
          h = box.height;

        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.stroke();
      },

      setExpressions = () => {
        let happy = faceData[0].expressions.happy,
            color = happy * 150 + 100;
        emoticon.style.bottom = (canvasH - 40) * happy + 'px';
        emoticon.style.backgroundColor = `rgb(${color}, ${color}, 100)`;
        if(happy > 0.5){
          emoticon.innerHTML = emoticonTxt[0];
        }else{
          emoticon.innerHTML = emoticonTxt[1];
        }
        let expressions = faceData[0].expressions;
        let smileProb = expressions['happy'];
        let smileScore = Math.round(smileProb * 100);
        score.innerHTML = `${myName ? myName : ''} 笑顔度: ${smileScore}`;
        sendSmile(`${smileScore}`);
      };
      setDetection();
      setExpressions();
    }
  };

  init();
};

FACE.EXPRESSION();
