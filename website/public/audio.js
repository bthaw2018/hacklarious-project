var audio = new Audio();
audio.src = "./topsecrethornsound.mp3";
audio.preload = 'auto';

function click() {
  const newAudio = audio.cloneNode()
  newAudio.play()
}

function playAudioOnKeyDown(e) {
  if (e.keyCode === 38) {
    document.getElementById("horn").src = "./squeezinghornist.png"
    click();
  }
}

function lift(e) {
  if (e.keyCode === 38) {
    document.getElementById("horn").src = "./hornist.png"
  }
}

function down() {
  document.getElementById("horn").src = "./squeezinghornist.png"
  click();
}
function up() {
  document.getElementById("horn").src = "./hornist.png"
}

document.onkeydown = playAudioOnKeyDown;
document.onkeyup = lift;

var boo = new Audio();
boo.src = "https://www.myinstants.com/media/sounds/jacksfilms-boo-sound-effect.mp3";
