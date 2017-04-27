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


// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
client.on ('ready', function(message) {
  console.log('I am ready!');
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

//bot listens for a message of a particular format and responds
client.on('message', function (message) {
    if (message.author.id === client.user.id) return; //ignore bot messages

	var text = message.content;
    if (text.includes(prefix)) {
        processCommand(message);
    } else if (text.includes('/') && message.author.id === adminID) {
        processAdminCommand(message);
    } else {
        processNonCommand(message);
    }
});

//Process commands from users
function processCommand (message) {
    var text = message.content;
    var mentions = message.mentions.users;

    if (text.includes('reminder')) {
        var time = parseInt(text.substring(text.indexOf('reminder ') + 9), 10) * 1000; //Time is requested in seconds so 60 would be a minute
        var reminder = text.substring(0, text.indexOf('reminder'));
        client.setTimeout(function(){
            sendMessage(message, message.author.username + ' here is your reminder ' + reminder);
        }, time);
    }
    else if (text.includes('latest tweet') && text.includes('@')) {
        var username = text.substring(text.indexOf('@')+1);
        getTweet(username, message); //sends message from within due to asynchronous twitter request
    }
    else if (text.includes('how dumb is') && containsMention(message)) {
        var name = getFirstMentionUsername(message);
		sendMessage(message, name + " is being " + rand(1, 100) + "% dumb right now!");
    }
    else if (text.toLowerCase().includes("should")) {
        var decision = rand(1, 2);
        if (decision == 1) {
		    sendMessage(message, message.author.username + "do it up fam!");
        } else {
            sendMessage(message, message.author.username + " nah fam.");
        }
    }
    else if (text.toLowerCase().includes("choose user")){
        var user = getRandomUser(message);
        sendMessage(message, 'The chosen user is: ' + user);
    }
    else if (text.toLowerCase().includes('youtube')) {
        var searchTerm = text.substring(text.indexOf('youtube') + 7);
        searchYoutube(message, searchTerm);
    }
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
    }
}

//Processes the commands by the admin based on adminID in discordConfig.json
function processAdminCommand (message) {
    var text = message.content;
        //Allows changing of default command prefix. Note: It will still go to default ! when the bot is restarted
    if (text.startsWith('/' + 'prefix')) {
        //Get arguements for the command, as !prefix +
        let args = text.split(" ").slice(1);
        if ( args[0].localeCompare('/') != 0) {
            //change the configuration prefix
            config.prefix = args[0];
        }
    }
}

function sendMessage (message, text) {
	message.channel.sendMessage(text);
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
 * Command logic Functions
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
        if (member.presence.status === 'online') {
           onlineMembers.push(member);
        }
    }

    var chosenIndex = rand(0, onlineMembers.length-1);
    var chosenMember = onlineMembers[chosenIndex];
    return chosenMember.displayName + " aka @" + chosenMember.user.username + "#" + chosenMember.user.discriminator;
    // return 'same';
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
            return;
        }
        var tweetLink = 'https://twitter.com/-/status/' + tweet[0].id_str;

        message.channel.sendEmbed({
            color: 3447003,
            title: '@' + handle + "'s Latest Tweet",
            url: tweetLink
        });
        sendMessage(message, tweet[0].text);

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
        console.log(result);
        console.log('\n\n\n');
        console.log(result.items);
        console.log('\n\n\n');
        console.log(result.items[0].id);
        var video = result.items[0].id.videoId;
        if (result.items[0].id.videoId !== undefined) {
            sendMessage(message, 'https://youtube.com/watch?v=' + result.items[0].id.videoId);
        }
        if (result.items[0].id.channelId !== undefined) {
            sendMessage(message, 'https://youtube.com/channel/' + result.items[0].id.channelId);
        }


    });
 }
