# Client
The NukeJS client comes in with options to configure and customize!

## options
The Client in itself, defaults to basic pre-defined options if nothing has been inputed.

Option | Input | Function | default
-------|-------|----------|--------
discordOptions | Object | Your normal Discord Options provided by discord.js | {}
readyMessage | string | The message that gets logged when the bot is online | ""
owner | string | The ID of the Owner of the Bot | ""
dev_ids | Array<string> | The IDs of the Bot devs | [owner]

## readyMessage
You can but ${client.user.username} to get the Username of the client itself and such stuff!