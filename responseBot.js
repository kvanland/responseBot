//import discord.js
const Discord = require('discord.js');

//create instance of discord client
const client = new Discord.Client();

//Gets configuration information from discordConfig.json
const config = require('./discordConfig.json');

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

//Log our bot in
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
    if (message.author.bot) return;

    var text = message.content;
    if (text.startsWith(prefix)) {
        processCommand(message);
    } else if (text.startsWith('~') && message.author.id === adminID) {
        processAdminCommand(message);
    } else {
        processNonCommand(message);
    }
    checkForPalindrome(message);
    message.channel.stopTyping(true);
});


var commands = require('./commands.js');
var commandNames = require('./commandNames');
commands.functions.setClient(client);

//Process commands from users
function processCommand (message) {
    var text = message.content.toLowerCase();
    var command = text.split(" ")[0];
    if(commandNames[command]){
        commands.functions[commandNames[command]](message);
    }
}

//JSON object that contians generic responses to specific messages
var responses = require('./responses.json');

//Process noncommands from anyone
function processNonCommand (message) {
    var text = message.content;
    if ( responses[text] ) {
        sendMessage(message, responses[text]);
    }
}

//Processes the commands by the admin based on adminID in discordConfig.json
function processAdminCommand (message) {
    var text = message.content;
    var mentions = message.mentions.users.array();
    if (text.startsWith('~' + 'prefix')) {
        let args = text.split(" ").slice(1);
        if ( args[0].localeCompare('~') != 0) {
            config.prefix = args[0];
        }
    }
}

function sendMessage (message, text) {
    message.channel.startTyping();
    client.setTimeout( function() {
        message.channel.send(text);
    }, 1000);
	message.channel.stopTyping(true);
}

/*
 *
 * Logic Functions
 *
 */

function checkForPalindrome (message) {
    var text = message.content;
    if (text.includes('\n')) return;

    var responseText = text.replace(/[^\w\d\s]+/g, ""); //replaces all characters except word and whitespace characters

    var evalText = responseText.replace(/ /g, "").toLowerCase();//replaces all spaces with empty characters
    var length = evalText.length;
    if (length < 7) return;

    for (var i = 0; i < (length/2); i++) {
        if (evalText.charAt(i) != evalText.charAt(length - i - 1)) {
            return;
        }
    }
    sendMessage(message, "'" + responseText + "'" + " is a palindrome!");
}
