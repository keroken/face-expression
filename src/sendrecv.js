const debug = true;
const sora = Sora.connection(process.env.SORA_SIGNAL_URL, debug);
const channelId = process.env.CHANNEL_ID;
const metadata = { 
  access_token: process.env.ACCESS_TOKEN
};
const options = {
  multistream: true,
};
const sendrecv = sora.sendrecv(channelId, metadata, options);

sendrecv.on('track', (event) => {
  const stream = event.streams[0];
  if (!document.querySelector(`#remote-video-${stream.id}`)) {
    const video = document.createElement('video');
    video.id = `remote-video-${stream.id}`;
    video.autoplay = true;
    video.playsinline = true;
    video.srcObject = stream;
    document.querySelector('#remote-videos').appendChild(video);
  }
});


sendrecv.on('removetrack', (event) => {
  if (document.querySelector(`#remote-video-${event.target.id}`)) {
    document.querySelector(`#remote-video-${event.target.id}`).remove();
  }
});

navigator.mediaDevices
  .getUserMedia({ audio: true, video: true })
  .then((stream) => sendrecv.connect(stream))
  .then((stream) => {
    document.querySelector('#camera').srcObject = stream;
  })
  .catch((e) => {
    console.error(e);
  });

