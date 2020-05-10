
var collection = firestore.collection("messages");
var query = collection.orderBy("timestamp", "asc");
var message_box = document.querySelector("#messages")

query.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(docChange => {
        if (docChange.type == "added") {
            var doc = docChange.doc;
            // console.log(doc.data());
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
            // new_message_content.textContent = doc.data().content;
            createRandomFonts(new_message_content, doc.data().content);
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
    new_message = replaceTextWithEmojis(new_message);
    sendMessage(new_message, nickname);
}

document.querySelector("#new-message-form").addEventListener("submit", e => {
    e.preventDefault();
    // var nickname = firebase.auth().currentUser.email;
    var nickname = document.querySelector("#new-message-form").querySelector("#new-message-nickname").value;
    if (nickname == "") {
        if (auth.currentUser.displayName != null && auth.currentUser.displayName != undefined && auth.currentUser.displayName != "") {
            nickname = auth.currentUser.displayName
        } else {
            if (auth.currentUser.email != undefined) {
                nickname = auth.currentUser.email.split("@")[0]
            } else {
                nickname = "Random User";
            }
        }

    }
    var messageContent = document.querySelector("#new-message-form").querySelector("#new-message-input").value;

    document.querySelector("#new-message-form").querySelector("#new-message-input").value = "";

    createMessage(messageContent, nickname);

})
const emojiCodePoints = {
    "👋": "U+1F44B"
}
const emojis = {
    "👋": ["hi", "hello", "wave"],
    "2️⃣": ["two", "to", "2"],
    "📝": ["test", "testing", "exam", "quiz"],
    "👍": ["good", "great", "perfect"],
    // "😉":["wink"] 
    "🥺": ["pleading", "want", "ask"],
    "🥰": ["love"],
    "😔": ["sad", "oh no"],
    "😂": ["lol", "laugh", "joy", "lmao"]

}
var textToEmoji = {};
Object.keys(emojis).forEach(emoji => {
    const phrases = emojis[emoji];
    phrases.forEach(phrase => {
        textToEmoji[phrase] = emoji;
    })
})

function replaceTextWithEmojis(inputString) {
    var inputAr = inputString.split(" ");
    var output = ""
    inputAr.forEach(word => {
        var space = " ";
        if (output == "") space = "";
        if (textToEmoji[word.replace(".", "").replace("!", "").replace(",", "")] != undefined) {
            output = output + space + textToEmoji[word.replace(".", "").replace("!", "").replace(",", "")];
        } else {
            output = output + space + word;
        }
    })
    return output;

}

function randomFontClass() {

    var fontAr = ["'Dancing Script', cursive", "'Orbitron', sans-serif", "'Press Start 2P', cursive", "'Monoton', cursive", "'Rock Salt', cursive", "'Rubik Mono One', sans-serif"]
    fonts = fontAr.length;
    var random = Math.floor(Math.random() * Math.floor(fonts))
    // return `r_font_${random + 1}`;
    return `${fontAr[random]}`;
}
function randomColorClass() {
    colors = ['red', 'blue', 'green', 'hotpink', 'orange']
    fonts = colors.length;
    var random = Math.floor(Math.random() * Math.floor(fonts))
    // return `r_font_color_${random + 1}`;
    return `${colors[random]}`
}
function randomSizeClass() {
    sizes = ["1.5em", "1em", "1em"];
    fonts = sizes.length;
    var random = Math.floor(Math.random() * Math.floor(fonts))
    return `${sizes[random]}`
    // return `r_font_size_${random + 1}`;
}

function createRandomFonts(parent, string) {
    string.split("").forEach(char => {
        var newEl = document.createElement("span");
        newEl.textContent = char;
        // newEl.classList.add(randomFontClass());
        // newEl.classList.add(randomColorClass());
        newEl.style.color = randomColorClass();
        newEl.style['font-family'] = randomFontClass();

        // emojis dont work right without this
        // console.log(char)
        if (char.match('^[A-Za-z0-9_.]+$')) {
            newEl.style['font-size'] = randomSizeClass();
        }

        //     console.log('true')
        // } else {
        //     // newEl.style['font-size'] = randomSizeClass();
        //     console.log('false')
        // }

        // if (char.match(emojiRegex) == false) {

        // }
        // newEl.classList.add(randomSizeClass());
        parent.appendChild(newEl);
    })
}
