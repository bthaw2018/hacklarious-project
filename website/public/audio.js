var audio = new Audio();
audio.src = "./topsecrethornsound.mp3";
audio.preload = 'auto';

function click() {
  const newAudio = audio.cloneNode()
  newAudio.play()
}

function playAudioOnKeyDown(e) {
  if (e.keyCode === 38) {
    click();
  }
}
document.onkeydown = playAudioOnKeyDown;
