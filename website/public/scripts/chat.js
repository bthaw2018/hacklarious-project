
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
i = ["3rd bridge guitar","Accordina","Accordion","Accordola","Acoustic bass guitar","Acoustic guitar","Aeolian harp","Aeolsklavier","Agidigbo","Agung","Agung a tamlang","Ajaeng","Alimba","AlphaSphere","Alphorn","Alto clarinet","Alto horn","Alto sarrusophone","Alto saxophone","Angélique","Appalachian dulcimer","Archlute","Arpeggione","Array mbira","Audiocubes","Autoharp","Babarak","Babendil","Bagpipes","Balafon","Balalaika","Bandoneón","Bandura","Banduria","Banjo","Banjo mandolin","Banjo ukulele","Barbat","Baritone horn","Baritone sarrusophone","Baritone saxophone","Baritone ukulele","Baryton","Bass clarinet","Bass drum","Bass guitar","Bass oboe","Bass sarrusophone","Bass saxophone","Basset clarinet","Basset-horn","Bassoon","Bazooka","Bell","Bell tree","Berimbau","Biniou","Biwa","Bock-a-da-bock","Bodhrán","Bombarde","Bongo drum","Boomwhacker","Bordonua","Boungu","Bouzouki","Bugle","Bullroarer","C melody saxophone","Cajón","Calliope","Carillon","Castanets","Cavaquinho","Celesta","Cello","Chap","Chapman stick","Charango","Chimes","Ching","Chitarra battente","Chuk","Cigar box guitar","Cigar box ukulele","Cimbalom","Cimbassi","Citole","Cittern","Clapper","Clapsticks","Clarinet","Classical guitar","Claves","Clavichord","Clavicylinder","Clavinet","Coconut shells","Comb","Concert ukulele","Concertina","Conch shell","Conn-o-sax","Contra-alto clarinet","Contrabass Balalaika","Contrabass clarinet","Contrabass sarrusophone","Contrabass saxophone","Contrabassoon","Cor anglais","Cornamuse","Cornet","Cornett","Corrugaphone","Cowbell","Cricri","Croix Sonore","Cromorne","Crotales","Crumhorn","Crwth","Crystallophones","Cuatro","Cuíca","Cymbal","Dabakan","Dahu","Daxophone","Dàn bau","Dàn gáo","Dàn nguyet","Dàn tam thap luc","Dàn tỳ bà","Dàn tranh","Denis d'or","Dhantal","Diddley bow","Didgeridoo","Dihu","Djembe","Dobro","Domra","Dotara","Double bass","Double flageolet","Double-neck guitjo","Drejelire","Drum kit","Drum machine","Drumbone","Dubreq stylophone","Duda","Dudelsack","Dulcimer","Dunun","Dutar","Duxianqin","Eigenharp","Eight-string guitar","Ektara","Electric cymbalum","Electric guitar","Electric thumb piano","Electronic organ","Eleke","English horn","Erhu","Erxian","Esraj","Euphonium","EWI","Faglong","Fangxiang","Fiddle","Fingerboard synthesizer","Flamenco guitar","Flexatone","Flugelhorn","Flute","Folgerphone","Fortepiano","Frankophone","French Horn","Fusetar","Gaita","Gandingan","Gandingan a kayo","Gangsa","Gayageum","Güiro","Gehu","Gendér","Geomungo","Gimbri","Gittern","Glass Armonica","Glass harp","Glasschord","Glockenspiel","Gloggomobil","Gopuz","Gottuvadhyam","Grand piano","Great Highland Bagpipe","Guitar","Guitar synthesizer","Guitarra quinta Huapanguera","Guitarrón","Guqin","Gusli","Guzheng","Haegeum","Hammered dulcimer","Hammond organ","Handpan","Hardanger fiddle","Harmoneon","Harmonica","Harmonium","Harp","Harp guitar","Harpsichord","Heckelphone","Hirtenschalmei","Hocchiku","Horn","Hosho","Huluhu","Hurdy gurdy","Hydraulophone","Igil","Ikembe","Irish bouzouki","Jammer keyboard","Jarana de son jarocho","Jarana huasteca","Jarana mosquito","Jarana segunda","Jarana tercera","Jaw harp","Jegog","Jiaohu","Jingle bells","Jug","Kabosy","Kadlong","Kaffir piano","Kagul","Kalimba","Kamancha","Kanklės","Kantele","Katzenklavier","Kazoos","Kemenche","Keyboard","Keytar","Khim","Khloy","Khlui","Kimophone","Kinnor","Kisanji","Kobza","Kokle","Kokyū","Komungo","Kora","Koto","Kouxian","Kraakdoos","Krin","Kubing","Kudyapi","Kulintang","Langeleik","Laruan","Laser harp","Leiqin","Lesiba","Likembe","Lirone","Lithophone","Lokanga","Lur","Lute","Lyra","Lyre","Maguhu","Majestic Bellowphone","Mando-bass","Mandocello","Mandoharp","Mandola","Mandolin","Mandora","Mandore","Maracas","Marímbula","Marimba","Marimbaphone","Marovany","Mbira","Mechanical music box","Mellophone","Mellotron","Melodica","Metallophones","Mezzo-soprano saxophone","MIDI keyboard","Mohan veena","Monster Tubulum","Morin khuur","Morsing","Musette","Musette de cour","Musical bow","Musical box","Musical saw","N-Odaiko","Nail violin","Natural horn","Natural trumpet","Northumbrian smallpipes","Nyckelharpa","Oboe","Oboe d'amore","Oboe da caccia","Ocarina","Octave mandolin","Octavin","Octoban","Octobass","Octocontra-alto clarinet","Octocontrabass clarinet","Omnichord","Ondes Martenot","Oopoochawa","Organ","Orpharion","Oud","Overtone zither","Paiban","Pak","Palendag","Pan pipes","Piano","Piccolo","Piccolo cello","Piccolo clarinet","Piccolo violino","Pin pia","Pipa","Pipe organ","Piston flute","Piwancha","Plasmaphone","Portuguese guitar","Psaltery","Pyrophone","Quatro","Quintephone","Rainstick","Ranat ek lek","Ranat thum lek","Ratchet","Rattle","Ravanahatha","Rebab","Rebec","Recorder","Reed organ","Requinto jarocho","Reyong","Rhodes piano","Rommelpot","Ruan","Rubab","Rudra vina","Sackbut","Sallameh","Sampler","Sansa","Sanshin","Santur","Sanxian","Sanza","Sarangi","Sarod","Sarrusophone","Saung","Saw sam sai","Saxophone","Saz","Saz Baglama","Scottish smallpipes","Se","Sea organ","Serpent","Setar","Seven-string guitar","Shakuhachi","Shamisen","Shawm","Sheng","Shishi odoshi","Shofar","Singing bowl","Siren","Sitar","Sitarla","Sk8 Guitar","Skoog","Slapstick","Sleigh bells","Slide guitar","Slide whistle","Slit drum","Slit gong","Snare drum","Sopranino clarinet","Sopranino mandolin","Sopranino saxophone","Soprano clarinet","Soprano sarrusophone","Soprano saxophone","Soprano ukulele","Soprillo","Sousaphone","Space Harp","Spoons","Steel guitar","Steelpan","Stroh violin","Subcontrabass saxophone","Suikinkutsu","Suling","Surma","Suroz","Swedish bagpipes","Swordblade","Synclavier","Synthesizer","Tabla","Tafelbergliam","Taiko","Tailed bridge guitar","Takuapu","Talharpa","Tamak","Tambourine","Tamburitza","Tank drum","Tanpura","Tar","Tarogato","Tea chest bass","Teleharmonium","Tembûr","Tenor Horn","Tenor sarrusophone","Tenor saxophone","Tenor ukulele","Tenor viola","Tenori-on","Tenoroon","Teponaztli","Theorbo","Theremin","Third bridge guitar","Thumb piano","Timpani","Timple","Tin whistle","Tiple","Tom","Tom-tom","Toy piano","Trembita","Tres","Triangle","Tro","Trombone","Trumpet","Trumpet marine","Tsymbaly","Tuba","Tubax","Tubular bells","Tubular Wood block","Tubulum","Tuhu","Tumdak'","Tumpong","Twelve-string guitar","Udu","Ugal","Uilleann Bagpipes","Ukulele","Upright piano","Valiha","Veena","Verrophone","Vertical viola","Vibrandoneon","Vibraphone","Vibraslap","Vichitra vina","Vielle","Vihuela","Viol","Viola","Viola d'amore","Viola da gamba","Viola organista","Violin","Violotta","Volynka","Vulcan Lute","Vuvuzela","Wagner tuba","Waj","Waldzither","Washboard","Washtub bass","Waterphone","Western concert flute","Whamola","Wheelharp","Whip","Whistle","Willow flute","Wobble board","Wood block","Xalam","Xun","Xylophone","Xylorimba","Yangqin","Yaylı tanbur","Yazheng","Yotar","Zampogna","Zhonghu","Zhuihu","Zimbabwean Marimba","Zither","Zummara"]

function randomize() {
    let random = i[Math.floor(Math.random() * i.length)];
    return document.getElementById("new-message-nickname").value = "Anonymous " + random;
}
