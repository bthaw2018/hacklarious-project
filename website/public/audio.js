let audio = []
getAudioFileFromGCS("boo", false).then(url => {
  audio[0] = new Audio();
  audio[0].src = url;
  audio[0].preload = 'auto';
}).catch(err => console.log(err.message));

getAudioFileFromGCS("topsecrethornsound", false).then(url => {
  audio[1] = new Audio();
  audio[1].src = url;
  audio[1].preload = 'auto';
}).catch(err => console.log(err.message));

getAudioFileFromGCS("chicken", false).then(url => {
  audio[2] = new Audio();
  audio[2].src = url;
  audio[2].preload = 'auto';
}).catch(err => console.log(err.message));

getAudioFileFromGCS("quack", false).then(url => {
  audio[3] = new Audio();
  audio[3].src = url;
  audio[3].preload = 'auto';
}).catch(err => console.log(err.message));

getAudioFileFromGCS("applause", true).then(url => {
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

function click(ind) {
  const newAudio = audio[ind].cloneNode();
  newAudio.play()
}

function playAudioOnKeyDown(e) {
  if (e.keyCode === 38) {
    document.getElementById("topsecrethornsound").src = "sources/images/squeezingtopsecrethornsound.png"
    click(1);
  }
  if (e.keyCode === 39) {
    document.getElementById("chicken").src = "sources/images/squeezingchicken.png"
    click(2);
  }
  if (e.keyCode === 37) {
    document.getElementById("quack").src = "sources/images/squeezingquack.png"
    click(3);
  }
}

function lift(e) {
  if (e.keyCode === 38) {
    document.getElementById("topsecrethornsound").src = "sources/images/topsecrethornsound.png"
  }
  if (e.keyCode === 39) {
    document.getElementById("chicken").src = "sources/images/chicken.png"
  }
  if (e.keyCode === 37) {
    document.getElementById("quack").src = "sources/images/quackt.png"
  }
}

function down(ind) {
  switch (ind) {
    case 0:
      break
    case 1:
      writeSoundToDatabase("topsecrethornsound")
      document.getElementById("topsecrethornsound").src = "sources/images/squeezingtopsecrethornsound.png"
      break
    case 2:
      writeSoundToDatabase("chicken")
      document.getElementById("chicken").src = "sources/images/squeezingchicken.png"
      break
    case 3:
      writeSoundToDatabase("quack")
      document.getElementById("quack").src = "sources/images/squeezingquack.png"
      break
    default:
      writeSoundToDatabase("applause", true)
      break
  }
  click(ind);
}
function up(ind) {
  switch (ind) {
    case 0:
      break
    case 1:
      document.getElementById("topsecrethornsound").src = "sources/images/topsecrethornsound.png"
      break
    case 2:
      document.getElementById("chicken").src = "sources/images/chicken.png"
      break
    case 3:
      document.getElementById("quack").src = "sources/images/quack.png"
      break
  }
}

document.onkeydown = playAudioOnKeyDown;
document.onkeyup = lift;


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

function writeSoundToDatabase(soundEffect, sound) {
  firestore.collection("soundEffects").add({
    timestamp: new firebase.firestore.Timestamp.now(),
    sender_uid: firebase.auth().currentUser.uid,
    sound_effect: soundEffect,
    sound_folder: (sound == true) ? true : false
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
          document.getElementById(data.sound_effect).src = "sources/images/squeezing" + data.sound_effect + ".png";
          //play sound
          getAudioFileFromGCS(data.sound_effect, data.sound_folder).then(url => {
            stream(url);
            document.getElementById(data.sound_effect).src = "sources/images/" + data.sound_effect + ".png";
          })
        }
      }

    }
  })
})
