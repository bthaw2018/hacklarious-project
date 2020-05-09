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
 * @param {String} soundEffect - Name of the sound effect
 * @param {Boolean} sound - Whether this is a normal sound instead of a sound effect.
 * @returns {Promise} Promise - Download URL
 */
function getAudioFileFromGCS(soundEffect, sound) {
  var rootPath = "sound_effects/"
  if (sound == true) rootPath = "sounds/";
  var ref = storage.ref(rootPath + soundEffect + ".mp3");
  var defaultRef = storage.ref(rootPath + "default" + ".mp3");
  return ref.getDownloadURL().then(url => {
    return url
  }).catch(err => {
    console.error(err.messaage);
    return defaultRef.getDownloadURL().catch(err2 => console.log(err2.message));
  })
}

function writeSoundToDatabase(soundEffect) {
  firestore.collection("soundEffects").add({
    timestamp: new firebase.firestore.Timestamp.now(),
    sender_uid: firebase.auth().currentUser.uid,
    sound_effect: soundEffect
  }).catch(err => console.error(err.message));
}
firestore.collection("soundEffects").onSnapshot(snapshot => {
  snapshot.docChanges().forEach(docChange => {
    var doc = docChange.doc;
    var data = doc.data();
    var type = docChange.type;
    if (type = "added") {
      var docTimestamp = data.timestamp.toDate();
      var currentTime = new Date();
      var difference = docTimestamp.getTime() - currentTime.getTime();
      var seconds = Math.abs(difference / 1000);

      if (seconds < 5) {
        console.log("less than 5 seconds");
        if (data.sender_uid != auth.currentUser.uid) {
          //play sound
        }
      }

    }
  })
})