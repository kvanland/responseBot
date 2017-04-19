# ResponseBot: The multifunction discord text chat bot

Node packages to install
### Discord.js | npm install discord.js

[Discord.js npm page](https://www.npmjs.com/package/discord.js)

[Discord.js documentation](https://discord.js.org/#/docs/main/stable/general/welcome)

[How to set up a discord bot](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token )

### Twitter | npm install twitter

[Twitter npm page](https://www.npmjs.com/package/twitter)

[How to set up a twitter application](http://techknights.org/workshops/nodejs-twitterbot/)

# Functions

## 1. Commands
Description: Commands can be made by any user to request that the bot do something. Commands include a ! symbol.
- !latest tweet @x | returns the latest tweet from the twitter user x
- description of reminder !reminder x | sends a message to the author of the command with the description in x number of seconds
- !how dumb is @x | returns a random percentage of how 'dumb' user x is being at that moment
- !should blah blah blah | returns a response of 'do it up fam!' or 'nah fam' randomly to a question that begins with !should`

## 2. Non-Commands
Description: Non-Commands are bits of text that will be responded to by the bot without the user of the ! symbol.
- ayyy | Bot responds with 'lmao' for the exact phrase 'ayyy'

## 3. Admin Commands
Description: Commands that can only be executed by the admin. Admin commands include a / symbol.
- /prefix x | changes the prefix for normal commands to x until the bot is restarted
