audio = []
getAudioFileFromGCS("boo",false).then(url => {
  audio[0] = new Audio();
  audio[0].src = url;
  audio[0].preload = 'auto';
}).catch(err => console.log(err.message));

getAudioFileFromGCS("topsecrethornsound",false).then(url => {
  audio[1] = new Audio();
  audio[1].src = url;
  audio[1].preload = 'auto';
}).catch(err => console.log(err.message));

getAudioFileFromGCS("chicken",false).then(url => {
  audio[2] = new Audio();
  audio[2].src = url;
  audio[2].preload = 'auto';
}).catch(err => console.log(err.message));

getAudioFileFromGCS("quack",false).then(url => {
  audio[3] = new Audio();
  audio[3].src = url;
  audio[3].preload = 'auto';
}).catch(err => console.log(err.message));

getAudioFileFromGCS("background",true).then(url => {
  audio[4] = new Audio();
  audio[4].src = url;
  audio[4].preload = 'auto';
}).catch(err => console.log(err.message));


function stream(url) {
  let aud = new Audio();
  aud.src = url;
  aud.play().then(r => console.log('Enjoy'))
      .catch(e => console.log(e.message));
}

function click(obj) {
  const newAudio = obj.cloneNode()
  newAudio.play()
}

function playAudioOnKeyDown(e) {
  if (e.keyCode === 38) {
    document.getElementById("horn").src = ".sources/images/squeezinghornist.png"
    click();
  }
}

function lift(e) {
  if (e.keyCode === 38) {
    document.getElementById("horn").src = ".sources/images/hornist.png"
  }
}

function down() {
  document.getElementById("horn").src = "./sources/images/squeezinghornist.png"
  click();
}
function up() {
  document.getElementById("horn").src = "./sources/images/hornist.png"
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
    console.error(err.message);
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
    if (type === "added") {
      var docTimestamp = data.timestamp.toDate();
      var currentTime = new Date();
      var difference = docTimestamp.getTime() - currentTime.getTime();
      var seconds = Math.abs(difference / 1000);

      if (seconds < 5) {
        // console.log("less than 5 seconds");
        if (data.sender_uid != auth.currentUser.uid) {
          //play sound
          getAudioFileFromGCS(data.sound_effect).then(url => {
            stream(url);
          })
        }
      }

    }
  })
})
