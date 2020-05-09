//simple sign in system
var auth = firebase.auth();
const soundcheck = new Audio();
bgload()

auth.onAuthStateChanged(user => {
    document.querySelector(".loading").style.display = "none";
    if (user) {
        soundcheck.pause();
        document.querySelectorAll(".logged-in").forEach(el => {
            el.style.display = "";
        })
        document.querySelectorAll(".logged-out").forEach(el => {
            el.style.display = "none";
        })
        document.querySelectorAll(".email").forEach(el => {
            el.textContent = "Logged in as " + user.email;
        })
        document.querySelector("body").style.backgroundImage = "";
    } else {
        document.querySelectorAll(".logged-in").forEach(el => {
            el.style.display = "none";
        })
        document.querySelectorAll(".logged-out").forEach(el => {
            el.style.display = "";
        })
        document.querySelector("body").style.backgroundImage = "url('./signin.png')";
        document.querySelectorAll(".email").forEach(el => {
            el.textContent = "Not signed in";
        })
    }
})
function bgload() {
    const ref = storage.ref("sounds/background.mp3");
    ref.getDownloadURL().then(r => soundcheck.src = r.toString());
}

function doSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    soundcheck.play().then(r => console.log(r));
    auth.signInWithPopup(provider).catch(err => {
        console.error(err.message);
        soundcheck.pause();
    });
}

function doSignOut() {
    auth.signOut();
}
document.querySelector("#sign_in_button").addEventListener('click', e => {
    e.preventDefault();
    doSignIn();
})
