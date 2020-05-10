process.stdout.write("Loading...");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");

const admin = require("firebase-admin");
var app = admin.initializeApp({
    storageBucket: 'hacklarious-tooturself.appspot.com'
});

client.on("ready", () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("Connected to Discord! Establishing voice connection. ")

    var channel = client.channels.cache.get("708866459425701889");

    doVoiceChannelStuff();

    var firestore = app.firestore();
    firestore.collection("messages").onSnapshot(snapshot => {
        snapshot.docChanges().forEach(docChange => {
            var doc = docChange.doc;
            var data = doc.data();
            var type = docChange.type;
            // console.log(data.content);
            var docTimestamp = data.timestamp.toDate();
            var currentTime = new Date();
            var difference = docTimestamp.getTime() - currentTime.getTime();
            var seconds = Math.abs(difference / 1000);

            if (seconds < 5) {
                // console.log(data.content);
                // channel.send("> " + data.content + "\n- " + data.author);
                var embed = new Discord.MessageEmbed();
                embed.setDescription(data.content)
                    // .addField("From", data.author)
                    .setFooter(client.user.tag, client.user.avatarURL)
                    .setTimestamp(data.timestamp.toDate());
                if (channel.guild.members.cache.get(data.author_uid) != undefined) {
                    var member = channel.guild.members.cache.get(data.author_uid);
                    // console.log(member.user.avatarURL);
                    embed.setAuthor(member.user.username, member.user.avatarURL);
                } else {
                    embed.setAuthor(data.author);
                }
                channel.send(embed)
            }
        })
    })
});

function doVoiceChannelStuff() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("TootUrSelf Discord bot ready!")
    process.stdout.write("\n");
    var voiceChannel = client.channels.cache.get("708852620730826806");

    voiceChannel.join().then(connection => {
        const broadcast = client.voice.createBroadcast();
        app.firestore().collection("soundEffects").onSnapshot(snapshot => {
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
                        //play sound
                        getAudioFileFromGCS(data.sound_effect, data.sound_folder).then(url => {
                            connection.play(url);
                            // broadcast.play(url);
                            // connection.play(broadcast);
                        })
                    }

                }
            })
        })
    })
}

function getAudioFileFromGCS(soundEffect, sound) {
    var bucket = app.storage().bucket();
    var options = {
        action: 'read',
        expires: '03-10-2025'
    }

    var rootPath = "sound_effects/"
    if (sound == true) rootPath = "sounds/";
    var file = bucket.file(rootPath + soundEffect + ".mp3");
    var defaultFile = bucket.file(rootPath + "default" + ".mp3");
    return file.getSignedUrl(options).then(url => {
        return url[0];
    }).catch(err => {
        defaultFile.getSignedUrl(options).then(url => { return url[0] }).catch(err2 => console.log(err2));
    })
    // return ref.getDownloadURL().then(url => {
    //     return url
    // }).catch(err => {
    //     console.error(err.message);
    //     return defaultRef.getDownloadURL().catch(err2 => console.log(err2.message));
    // })
}


client.on("message", message => {
    if (message.channel.type == "text") {
        if (message.channel.guild.id == "708852620730826802") {
            if (message.author.bot == false) {
                if (message.channel.id == "708866459425701889")
                    app.firestore().collection("messages").add({
                        author: (message.member.nickname == undefined) ? message.author.username : message.member.nickname,
                        author_uid: message.author.id,
                        content: message.content,
                        deleted: false,
                        timestamp: admin.firestore.Timestamp.now()
                    }).then(() => {
                        try {
                            message.delete()
                        } catch (err) {
                            console.error(err.message);
                        }
                    }).catch(console.error)
                // console.log(message.member.nickname);
            }
        }
    }
    // return;
})

client.login(config.token)