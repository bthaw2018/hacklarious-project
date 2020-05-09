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

/**
 * 
 * @param {String} soundEffect 
 * @returns {Promise} Promise - Download URL
 */
function getAudioFileFromGCS(soundEffect) {
  var ref = storage.ref("sound_effects/" + soundEffect + ".mp3");
  var defaultRef = storage.ref("sound_effects/" + "default" + ".mp3");
  return ref.getDownloadURL().then(url => {
    return url
  }).catch(err => {
    console.error(err.messaage);
    return defaultRef.getDownloadURL().catch(err2 => console.log(err.message));
  })
}