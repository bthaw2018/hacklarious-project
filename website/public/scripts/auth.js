//simple sign in system

var auth = firebase.auth();

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
        document.querySelector(".horn").src = "./hornist.png";
    } else {
        document.querySelectorAll(".logged-in").forEach(el => {
            el.style.display = "none";
        })
        document.querySelectorAll(".logged-out").forEach(el => {
            el.style.display = "";
        })
        document.querySelectorAll(".email").forEach(el => {
            el.textContent = "Not signed in";
        })
    }
})
var soundcheck = new Audio();
soundcheck.src = "https://retired.sounddogs.com/previews/40/mp3/418198_SOUNDDOGS__or.mp3";

function doSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    soundcheck.play();
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
