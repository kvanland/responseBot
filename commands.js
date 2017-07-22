var client = null;

exports.functions = {

    setClient: function(c) {
        client = c;
    },

    reminder: function(message) {
        let text = message.content;
        let args = text.split(" ").slice(1);
        var time = parseInt(args[0], 10) * 1000; //Time is requested in seconds so 60 would be a minute
        if (isNaN(time)) {
            sendMessage(message, message.author.username + " you need to set a valid time for your reminder.");
        }
        else {
            args = args.slice(1);
            var reminder = args.join().replace(/,/g," ");
            client.setTimeout(function(){
                sendMessage(message, message.author.username + ' here is your reminder. \n' + reminder);
            }, time);
        }
    },

    latesttweet: function(message) {
        let text = message.content;
        if(text.includes("@")) {
            var username = text.substring(text.indexOf('@')+1);
            getTweet(username, message); //sends message from within due to asynchronous twitter request
        }
    },

    randomnum: function(message) {
        let text = message.content;
        var splitMessage = text.split(" ");
        var parameters = splitMessage[splitMessage.length-1].split("-");
        var minVal = parseInt(parameters[0]);
        var maxVal = parseInt(parameters[1]);
        if (!isNaN(minVal) && !isNaN(maxVal)) {
            if(minVal < maxVal) sendMessage(message, "" + rand(minVal, maxVal));
            else sendMessage(message, "" +rand(maxVal, minVal));
        }
        else {
            sendMessage(message, "Please use valid numbers for the random command.");
        }
    },

    yesorno: function(message) {
        if (rand(0,1)) {
		    sendMessage(message, "Yes, " + message.author.username);
        }
        else {
            sendMessage(message, "No, " + message.author.username);
        }
    },

    chooseuser: function(message) {
        var user = getRandomUser(message);
        sendMessage(message, 'The chosen user is: ' + user);
    },

    chooserole: function(message) {
        if (message.guild.available) {
            var role = getRandomRole(message);
            sendMessage(message, 'The chosen role is: ' + role);
        }
    },

    youtube: function(message) {
        let text = message.content;
        var searchTerm = text.substring(text.indexOf('!youtube') + 8).trim();
        if (searchTerm === "") sendMessage(message, 'https://youtu.be/K93zcgFsynk'); //Blank search term give blank title video
        else searchYoutube(message, searchTerm);
    },

    help: function(message) {
        message.channel.sendEmbed({
            color: 3447003,
            title: "Here is the README for responseBot! Please take a look and contact the developer for any questions.",
            url: 'https://github.com/kvanland/responseBot/blob/master/README.md'
        });
    },

    thanks: function(message) {
        var text = message.content;
        if(containsMention(message)){
            var mentionedName = getFirstMentionUsername(message);
            var botName = client.user.username;
            if (mentionedName === botName) {
                sendMessage(message, "You're welcome!");
            }
        }
    },

    avatar: function(message) {
        sendMessage(message, "Here is your avatar url, " + message.author.avatarURL);
    },

    wolfram: function(message) {
        var text = message.content;
        var query =  text.substring(text.indexOf('!wolfram') + 8).trim();
        queryWolfram(message, query);
    }
}

//HELPER METHODS

//Sends message to discord channel containing the text passed into the function
function sendMessage (message, text) { //void
    message.channel.startTyping();
    client.setTimeout( function() {
        message.channel.send(text);
    }, 1000);
    message.channel.stopTyping(true);
}

//Returns random min to max integer
function rand (min, max) { //int
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Returns the name of a random online user
function getRandomUser (message) { //String
    var channel = message.channel;
    var members = message.channel.members;
    var membersKeys = members.keyArray();
    var onlineMembers = [];

    for (var i = 0; i < membersKeys.length; i++) {
        var member = members.get(membersKeys[i]);
        if (member.presence.status === 'online' && member.id != client.user.id) {
           onlineMembers.push(member);
        }
    }

    var chosenIndex = rand(0, onlineMembers.length-1);
    var chosenMember = onlineMembers[chosenIndex];
    return chosenMember.displayName + " aka @" + chosenMember.user.username + "#" + chosenMember.user.discriminator;
}

//Returns the name of a random role that has one online member
function getRandomRole (message) { //String
    var guildRoles = message.guild.roles.array();
    var availableRoles = [];
    for (var i = 0; i < guildRoles.length; i++) {
        var members = guildRoles[i].members.array();
        for(var j = 0; j < members.length; j++) {
            if(members[j].presence.status === 'online' && guildRoles.indexOf(guildRoles[i].name) === -1 && guildRoles[i].name !== '@everyone') {
                availableRoles.push(guildRoles[i].name);
            }
        }
    }
    var chosenRole = availableRoles[rand(0, availableRoles.length-1)];
    return chosenRole;
}

//Returns the username of the first
function getFirstMentionUsername (message) {
    var key = message.mentions.users.firstKey();
    return message.mentions.users.get(key).username;
}

function containsMention (message) {
    var mentions = message.mentions.users;
    return (mentions != undefined & mentions.length != 0);
}

/*
 *
 * Twitter Package
 *
 *
 */

var TwitterPackage = require('twitter');

var secret = require('./twitterConfig.json');

var Twitter = new TwitterPackage(secret);

//Returns the latest tweet from a specific twitter handle
function getTweet (handle, message) {
    Twitter.get('statuses/user_timeline', {screen_name: handle, count: 1},  function(error, tweet, response){
        if (error) {
            sendMessage(message, "Beep Boop: User could not be found");
            console.log(error);
            return;
        }
        var tweetLink = 'https://twitter.com/' + handle + '/status/' + tweet[0].id_str;

        sendMessage(message, tweetLink);
    });
}

/*
 *
 * Youtube Package
 *
 */

var youtubePackage = require('youtube-node');

var youtube = new youtubePackage();

var youtubeConfig = require('./youtubeConfig.json');

youtube.setKey(youtubeConfig.key);

function searchYoutube (message, searchTerm) {
    youtube.search (searchTerm, 3, function(error, result) {
        if (error) {
            sendMessage(message, 'Beep Boop: Something went wrong');
            console.log(error);
            return;
        }
        var video = result.items[0].id.videoId;
        if (result.items[0].id.videoId !== undefined) {
            sendMessage(message, 'https://youtube.com/watch?v=' + result.items[0].id.videoId);
        }
        if (result.items[0].id.channelId !== undefined) {
            sendMessage(message, 'https://youtube.com/channel/' + result.items[0].id.channelId);
        }
    });
}

/*
 *
 * Wolfram Package
 *
 *
 */

var nodeWolfram = require("node-wolfram")
var Wolfram = new nodeWolfram('YPU6TP-UJXYY683K9');

function queryWolfram (message, searchTerm) {
    Wolfram.query(searchTerm, function(err, result) {
        if(err) {
            sendMessage(message, "There was an error: " + err);
            console.log(err);
        }
        else {
        for(var i = 0; i < result.queryresult.pod.length; i++) {
            var pod = result.queryresult.pod[i];
            var str = pod.$.title + ": ";
            for(var j = 0; j < pod.subpod.length; j++){
                var subpod = pod.subpod[j];
                for(var k = 0; k < subpod.plaintext.length; k++)
                {
                    str = str.concat(subpod.plaintext[k] + '\t');
                }
            }
            sendMessage(message, str);
        }
    }
    });
 }
