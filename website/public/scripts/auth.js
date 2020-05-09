//simple sign in system

var auth = firebase.auth();

auth.onAuthStateChanged(user => {
    document.querySelector(".loading").style.display = "none";
    if (user) {
        document.querySelectorAll(".logged-in").forEach(el => {
            el.style.display = "";
        })
        document.querySelectorAll(".logged-out").forEach(el => {
            el.style.display = "none";
        })
        document.querySelectorAll(".email").forEach(el => {
            el.textContent = "Logged in as " + user.email;
        })
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

function doSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    auth.signInWithPopup(provider).catch(err => {
        console.error(err.message);
    })
}

function doSignOut() {
    auth.signOut();
}
document.querySelector("#sign_in_button").addEventListener('click', e => {
    e.preventDefault();
    doSignIn();
})