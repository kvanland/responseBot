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
client.on('ready', function(message){
  console.log('I am ready!');
});

//log our bot in
client.login(token, output);
function output(error, token) {
    if (error) {
        console.log(`There was an error logging in: ${error}`);
        return;
    } else
        console.log(`Logged in. Token: ${token}`);
}

//bot listens for a message of a particular format and responds
client.on('message', function(message) {
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
function processCommand(message) {
    var text = message.content;
    var mentions = messsage.menitons.users;

        //Allows user to request a reminder message x seconds
    if (text.includes('reminder')) {
        var time = parseInt(text.substring(text.indexOf('reminder ') + 9), 10) * 1000; //Time is requested in seconds so 60 would be a minute
        var reminder = text.substring(0, text.indexOf('reminder'));
        client.setTimeout(function(){
            sendMessage(message, message.author.username + ' here is your reminder ' + reminder);
        }, time);

        //Allows user to request the text of the latests tweet from x user
    } else if (text.includes('latest tweet') && text.includes('@')) {
        var username = text.substring(text.indexOf('@')+1);
        getTweet(username, message); //sends message from within due to asynchronous twitter request

        //gets random idiot percentage
    } else if (text.includes('how dumb is') && containsMention(message)) {
        var name = getFirstMentionUsername(message);
		sendMessage(message, name + " is being " + rand(1, 100) + "% dumb right now!");

        //encourages or discourages author's yes or no question
    } else if (text.toLowerCase().includes("should")) {
        var decision = rand(1, 2);
        if (decision == 1) {
		    sendMessage(message, message.author.username + "do it up fam!");
        } else {
            sendMessage(message, message.author.username + " nah fam.");
        }
    }
}

//Process noncommands from anyone
function processNonCommand(message) {
    var text = message.content;
    var mentions = message.mentions.users;
        //responds to thank you
    if (text.toLowerCase().includes("thanks") && containsMention(message)) {
		var mentionedName = getFirstMentionUsername(message);
        var botName = client.user.username;
		if (mentionedName === botName) {
			sendMessage(message, "you're welcome boi");
		}

         //responds to ayyy or with lmao
    } else if (text.toLowerCase().includes('ayyy')) {
        var textArray = text.toLowerCase().split(' ');
        var found = textArray.indexOf('ayyy');
        if (found != -1) //checks if ayyy is its own word
            sendMessage(message, 'lmao');
    }
}

//Processes the commands by the admin based on adminID in discordConfig.json
function processAdminCommand(message){
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

//returns random min to max integer
function rand(min, max) {
	 return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendMessage(message, text) {
	message.channel.sendMessage(text);
}

function containsMention(message){
    var mentions = message.mentions.users;
    return (mentions != undefined & mentions.length != 0);
}

function getFirstMentionUsername(message) {
    var key = message.mentions.users.firstKey();
    return message.mentions.users.get(key).username;
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
function getTweet(handle, message){
    Twitter.get('statuses/user_timeline', {screen_name: handle, count: 1},  function(error, tweet, response){
        if (error) {
            sendMessage(message, "Beep Boop: User could not be found");
        }
            sendMessage(message, '@' + handle + " 's latest tweet: \n\n" + tweet[0].text);  //Sends tweet text to the channel
        });
}
