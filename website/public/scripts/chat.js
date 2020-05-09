
var collection = firestore.collection("messages");
var query = collection.orderBy("timestamp", "asc");
var message_box = document.querySelector("#messages")

query.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(docChange => {
        if (docChange.type == "added") {
            var doc = docChange.doc;
            console.log(doc.data());
            var new_message = document.createElement("div");
            new_message.classList.add("message", "list-group-item");

            var new_message_header = document.createElement("div");
            new_message_header.classList.add("d-flex", "w-100", "justify-content-between");

            new_message.setAttribute("id", "message_" + doc.id);
            var new_message_author = document.createElement("h5");
            new_message_author.textContent = doc.data().author;
            new_message_author.classList.add("message-author", "mb-1");
            new_message_author.setAttribute("data-author-uid", "message_author_" + doc.data().author_uid);

            var new_message_content = document.createElement("p");
            new_message_content.textContent = doc.data().content;
            new_message_author.classList.add("message-content", "mb-1");

            var new_message_time = document.createElement("small");
            var timestamp = doc.data().timestamp.toDate();
            var hour = timestamp.getHours();
            var minutes = timestamp.getMinutes();
            new_message_time.textContent = `${(hour > 12) ? (hour - 12) : hour}:${(minutes < 10) ? "0" + minutes : minutes} ${(hour >= 12) ? "PM" : "AM"}`;
            new_message_time.classList.add("message-timestamp");


            new_message_header.appendChild(new_message_author)
            new_message_header.appendChild(new_message_time)
            new_message.appendChild(new_message_header)


            new_message.appendChild(new_message_content)
            message_box.appendChild(new_message);

            message_box.scrollTop = message_box.scrollHeight;

        }
    })
})

function sendMessage(message_content, nickname) {
    collection.add({
        content: message_content,
        author: nickname,
        author_uid: firebase.auth().currentUser ? firebase.auth().currentUser.uid : nickname,
        timestamp: new firebase.firestore.Timestamp.now(),
        deleted: false
    })
}
function createMessage(message, nickname) {
    var new_message = message;
    sendMessage(new_message, nickname);
}

document.querySelector("#new-message-form").addEventListener("submit", e => {
    e.preventDefault();
    // var nickname = firebase.auth().currentUser.email;
    var nickname = document.querySelector("#new-message-form").querySelector("#new-message-nickname").value;
    if (nickname == "") nickname = "no nickname";
    var messageContent = document.querySelector("#new-message-form").querySelector("#new-message-input").value;

    document.querySelector("#new-message-form").querySelector("#new-message-input").value = "";

    createMessage(messageContent, nickname);

})