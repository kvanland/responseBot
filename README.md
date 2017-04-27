# ResponseBot: The multifunction discord text chat bot

## Node packages to install
### Discord.js | npm install discord.js

[Discord.js npm page](https://www.npmjs.com/package/discord.js)

[Discord.js documentation](https://discord.js.org/#/docs/main/stable/general/welcome)

[How to set up a discord bot](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token )

### Twitter | npm install twitter

[Twitter npm page](https://www.npmjs.com/package/twitter)

[How to set up a twitter application](http://techknights.org/workshops/nodejs-twitterbot/)

### youtube-node | npm install youtube-node

[Youtube-node npm page](https://www.npmjs.com/package/youtube-node)

[Set up a youtube api key](https://console.developers.google.com/apis/dashboard)

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


# Functions

## 1. Commands
Description: Commands can be made by any user to request that the bot do something. Commands include a ! symbol.
- !latest tweet @x
> Returns the contents of the latest tweet from the twitter user x

- description of reminder !reminder x
> Sends a message to the author of the command with the description in x number of seconds

- !how dumb is @x
> Returns a random percentage of how 'dumb' user x is being at that moment

- !should blah blah blah
> Returns a response of 'do it up fam!' or 'nah fam' randomly to a question that begins with !should`

- !youtube x
> Returns first result of a youtube search for term x

## 2. Non-Commands
Description: Non-Commands are bits of text that will be responded to by the bot without the user of the ! symbol.
- ayyy
> Bot responds with 'lmao' for the exact phrase 'ayyy'

- kys
> Bot responds with 'National Suicide Prevention Hotline: 1-800-273-8255' to the exact phrase 'kys'

## 3. Admin Commands
Description: Commands that can only be executed by the admin. Admin commands include a / symbol.
- /prefix x
> Changes the prefix for normal commands to x until the bot is restarted
