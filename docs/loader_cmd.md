# CommandLoaders
CommandLoaders take care of loading, handling and parsing commands. Without them, your Bot wouldn't be capable of recognizing commands!

CommandLoaders give you the freedom and joy of being able to initialize many of them. This allows you to make two seperate command systems. As an example you could have staff use the prefix "n>" and users use "s>" and so they wouldn't mix up.

CommandLoaders recursively scan directories and load all commands located in them. If you allow the Loader to set the first sub Folder as Categories, it will read the folders
Moderation -> Admins -> delete.js
delete.js would be added to the category Moderation, unless predefined in the command itself

## initialization
A basic CommandLoader would be
```js
const normalCommands = new nukejs.CommandLoader(client, {directory: "./commands", prefix: "n>"});
```

CommandLoaders have many options you can play with!

## Parameter

Option | Input | Function | default
------------ | ------------- | ------------- | -------------
directory | string | Sets the Command directory, of where all the commands are located | none
prefix | string/(message)=>string | The prefix of the Commands loaded by this CommandLoader | none
name | string | The name of the Loader to be able to identify it through Inhibitors and such | ""
allowMention | boolean | Allows the Commands to be triggered by Mentioning the Bot aswell as using prefix | true
extensions | Array<string> | In cases that you happen to use another extension other than the default ones (example using coffeescript) you may add more extension in here | [".js", ".ts"]
folderCategory | boolean | This option activates if the Folder the Command is in should be used as the category, keep in mind. If you file is in moderation -> admins -> ban.js, moderation will be its category and not admins | true
logCommands | boolean | Whether or not the commands that were run should be logged in the console | false
handleEditing | boolean | Whether editing a message should also trigger the command handler | false
blockBot | boolean | If Bots should be blocked from running commands | true
blockClient | boolean | If the Client should be blocked from running commands | true
ignoreCooldown | Array<string> | An array with IDs of users who can bypass the Cooldown | [OwnerID]
ignorePerms | Array<string> | An array with IDs of users that can bypass the perm checks | []
ignoredInhibitors | Array<string> | Array of Inhibitors (by name) that are ignored by this Loader | []
errorOutput | boolean | Whether or not it should send an error embed when you throw a new Error | true

## Guild Specific Prefixes

If you want to have a guild specific prefix, you can accomplish this, by instead of a literal string in the prefix section, you add in a function that returns a string.
For example with Mongoose:
```js
import mongoose from "mongoose"
import Guild from "./database/models/GuildConfig"

let commandLoader = new CommandLoader(client, { directory: "./dist/commands" ,prefix: async (message) => {return (await  mongoose.model("GuildConfig").findOne({id: message.guild.id}).exec()).get("prefix")} });
```

## Events

Every Loader comes with its own set of Events, you can catch those Events and handle them however you wish!

Event | when | data
------|------|-----
loaded | Emitted whenever a command is emitted | path: Path to Command File
malformed | Emitted whenever a malformed command was found | path: Path to Command File
executed | Emitted whenever a command is executed | command: Command name
cmd_error | executed whenever an error occurs | command: Command Name; error: Error that was received