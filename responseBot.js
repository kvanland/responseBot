//import discord.js
const Discord = require('discord.js');

//create instance of discord client
const client = new Discord.Client();

//Gets configuration information from discordConfig.json
const config = require('./discordConfig.json')

//Token for bot
const token = config.token;

//ID of Admin
const adminID = config.adminID;

//Command prefix
const prefix = config.prefix;


// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
client.on ('ready', function(message) {
  console.log('ResponseBot is ready!');
});

//log our bot in
client.login(token, output);
function output (error, token) {
    if (error) {
        console.log(`There was an error logging in: ${error}`);
        return;
    } else
        console.log(`Logged in. Token: ${token}`);
}

//Bot listens for a message of a particular format and responds
client.on('message', function (message) {
    if (message.author.id === client.user.id) return; //The bot will ignore messages it sends itself

	var text = message.content;
    if (text.includes(prefix)) { //Commands
        processCommand(message);
    } else if (text.includes('/') && message.author.id === adminID) { //Admin Commands
        processAdminCommand(message);
    } else {
        processNonCommand(message);
    }
    message.channel.stopTyping(true);
});

//Process commands from users
function processCommand (message) {
    var text = message.content;

    if (text.includes('!reminder')) {
        var time = parseInt(text.substring(text.indexOf('reminder ') + 9), 10) * 1000; //Time is requested in seconds so 60 would be a minute
        var reminder = text.substring(0, text.indexOf('reminder'));
        client.setTimeout(function(){
            sendMessage(message, message.author.username + ' here is your reminder ' + reminder);
        }, time);
    }
    else if (text.includes('!latest tweet') && text.includes('@')) {
        var username = text.substring(text.indexOf('@')+1);
        getTweet(username, message); //sends message from within due to asynchronous twitter request
    }
    else if (text.includes('!random')) {
        var splitMessage = text.split(" ");
        var parameters = splitMessage[splitMessage.length-1].split("-");
        var minVal = parseInt(parameters[0]);
        var maxVal = parseInt(parameters[1]);
        if(minVal < maxVal)
		      sendMessage(message, "" + rand(minVal, maxVal));
    }
    else if (text.toLowerCase().includes("!should")) {
        var decision = rand(1, 2);
        if (decision == 1) {
		    sendMessage(message, message.author.username + ", do it up fam!");
        } else {
            sendMessage(message, message.author.username + ", nah fam.");
        }
    }
    else if (text.toLowerCase().includes("!choose user")) {
        var user = getRandomUser(message);
        sendMessage(message, 'The chosen user is: ' + user);
    }
    else if (text.toLowerCase().includes("!choose role")) {
        if (message.guild.available) {
            var role = getRandomRole(message);
            sendMessage(message, 'The chosen role is: ' + role);
        }
    }
    else if (text.toLowerCase().includes('!youtube')) {
        var searchTerm = text.substring(text.indexOf('youtube') + 7);
        searchYoutube(message, searchTerm);
    }
    else if (text.toLowerCase().includes('!help')) {
        message.channel.sendEmbed({
            color: 3447003,
            title: "Here is the README for responseBot!",
            url: 'https://github.com/kvanland/responseBot/blob/master/README.md'
        });
    }
    /*
    else if (text.toLowerCase().includes('!wordcloud')) {
        console.log("Verified word cloud request");
        var messagesPromise = message.channel.fetchMessages({limit: 100});
        messagesPromise.then((messages) => {
            var messagesArray = messages.array();
            console.log(messagesArray.length);

            for(var i = 0; i < messagesArray.length; i++){
                console.log(messagesArray[i]);
            }
        });
        console.log("Got the messages");
    }
    */
}

//JSON object that contians generic responses to specific messages
var responses = require('./responses.json');

//Process noncommands from anyone
function processNonCommand (message) {
    var text = message.content;
    var mentions = message.mentions.users;

        //responds to thank you
    if (text.toLowerCase().includes("thanks") && containsMention(message)) {
		var mentionedName = getFirstMentionUsername(message);
        var botName = client.user.username;
		if (mentionedName === botName) {
			sendMessage(message, "you're welcome boi");
		}
        //Utilizes generic responses object from responses.json file
    } else if ( responses[text] ) {
        sendMessage(message, responses[text]);
    } else {
        checkForPalindrome(message);
    }
}

//Processes the commands by the admin based on adminID in discordConfig.json
function processAdminCommand (message) {
    var text = message.content;
    var mentions = message.mentions.users.array();
        //Allows changing of default command prefix. Note: It will still go to default ! when the bot is restarted
    if (text.startsWith('/' + 'prefix')) {
        //Get arguements for the command, as !prefix +
        let args = text.split(" ").slice(1);
        if ( args[0].localeCompare('/') != 0) {
            //change the configuration prefix
            config.prefix = args[0];
        }
    }
    /*
    } else if (text.includes('mute')) {
        console.log(mentions);
        if (mentions.length != 0) {
            console.log("Mute!");
            client.muteMember(mentions[0], message.channel, function(error) {
                console.log(error);
            })
        }
    }
    */
}

function sendMessage (message, text) {
    message.channel.startTyping();
    client.setTimeout( function() {
        message.channel.send(text);
    }, 1000);
	message.channel.stopTyping(true);
}

function containsMention (message) {
    var mentions = message.mentions.users;
    return (mentions != undefined & mentions.length != 0);
}

function getFirstMentionUsername (message) {
    var key = message.mentions.users.firstKey();
    return message.mentions.users.get(key).username;
}

/*
 *
 * Logic Functions
 *
 */

 //returns random min to max integer
function rand (min, max) {
 	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomUser (message) {
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

function getRandomRole (message) {
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

function checkForPalindrome (message) {
    var text = message.content;
    var trimmedText = text.replace(/ /g,""); //replaces all spaces with empty characters
    var length = trimmedText.length;
    for (var i = 0; i < (length/2); i++) {
        if (trimmedText.charAt(i) != trimmedText.charAt(length - i - 1)) {
            return
        }
    }
    sendMessage(message, "'" + text + "'" + " is a palindrome!")
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
