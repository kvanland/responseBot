# ResponseBot: The multifunction discord text chat bot
[Website](https://kvanland.github.io/responseBot/)
## Packages required
### Can install all packages with '$yarn install'

### Discord.js
[Discord.js npm page](https://www.npmjs.com/package/discord.js)

[Discord.js documentation](https://discord.js.org/#/docs/main/stable/general/welcome)

[How to set up a discord bot](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token )

### Twitter
[How to set up a twitter application](http://techknights.org/workshops/nodejs-twitterbot/)

### youtube-node
[Set up a youtube api key](https://console.developers.google.com/apis/dashboard)

### node-wolfram

# Configuration
These are the values that you must alter to get ResponseBot to set up correctly


### discordConfig.json
- token: The token that corresponds to your discord bot
- prefix: The symbol that you prepend all Commands
- admin: The ID of the designated admin on the discord server

### twitterConfig.json
- consumer_key: Obtained by creating a twitter application
- consumer_secret: Obtained by creating a twitter application
- access_token_key: Obtained by creating a twitter application
- access_token_secret: Obtained by creating a twitter application

### youtubeConfig.json
- key: The Youtube api key

### wolframConfig.json
- appID: The Wolfram Alpha api key

# Running ResponseBot
To run ResponseBot you can enter "node responseBot.js" in the terminal and it will run on your local machine.


# Functions

## 1. Commands
Description: Commands can be made by any user to request that the bot do something. Commands include a ! symbol by default.
- !help
> Returns a link to this README document

- !latesttweet @x
> Returns the contents of the latest tweet from the twitter user x. Keep in mind this only works for public accounts.

- !reminder x description of reminder !
> Returns a message with the description in x number of seconds.

- !randomnum x-y
> Returns a random whole number between number x and number y.

- !yesorno blah blah blah
> Returns a response of 'Yes, *username*' or 'No, *username*' with equal chance for either response`

- !youtube x
> Returns first result of a youtube search for term or phrase x

- !chooseuser
> Returns a random user that is online

- !chooserole
> Returns a random role that has at least one member online

- !avatar
> Returns the url for the user's avatar, essentially returns the user's avatar image

- !wolfram query
> Returns a whatever wolfram alpha returns based on the query

- !thanks @responseBot
> Bot responds with 'You're welcome!'

## 2. Non-Commands
Description: Non-Commands are bits of text that will be responded to by the bot without the user of the ! symbol.

- ayyy
> Bot responds with 'lmao' to the exact phrase 'ayyy'

- kys
> Bot responds with 'National Suicide Prevention Hotline: 1-800-273-8255' to the exact phrase 'kys'

- (Some palindrome)
> Bot responds to any palindrome with length less than 6 with '"(Some palindrome)" is a palindrome!'. Note that it only excludes spaces when considering whether a message is a palindrome so any other character will be considered by the bot.

## 3. Admin Commands
Description: Commands that can only be executed by the admin. Admin commands include a / symbol.
- ~prefix x
> Changes the prefix for normal commands to x until the bot is restarted
