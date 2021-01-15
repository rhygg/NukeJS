# Getting Started
NukeJS, is meant to be used with discord.js version 12 or higher.

## Installation

### NPM
```bash
$ npm install nukejs
```
Please make sure you also install discord.js, else it wont work!

## First Steps

So to begin with, you have to setup a NukeJS Client instance. Just like you would with discord.js!

So in your index file, in this case the index.js, it has to look like this:

```js
const nukejs = require("nukejs")

let client = new nukejs.Client({});

client.login(TOKEN);
```

This would get your bot to run, but it would have no functionality at all! So what you need to do, is add Loaders

## Understanding Loaders

Loaders, are the hearts of the NukeJS Components, Commands and Events just like Inhibitors are registered and handled by Loaders.
So in this case if we want to be able to make Commands, we need to have a CommandLoader. To such we have to add
```js
const normalCommands = new nukejs.CommandLoader(client, {directory: "./commands", prefix: "n>", allowMention: true});
```
into our client js File. Our Client file now looks like the following:
```js
const nukejs = require("nukejs")

let client = new nukejs.Client({});

const normalCommands = new nukejs.CommandLoader(client, {directory: "./commands", prefix: "n>", allowMention: true});

client.login(TOKEN);
```

Now we can start loading in Commands into our defined directory, here being "./commands"!

## Simple Commands

To make a command, we have to create a new JS file and have the input look as following:
```js
const { Command } = require('nukejs');

module.exports = class extends Command {
    constructor(file) {
        super(file, {
            name: "test",
            runIn: ["text"]
        });
    }

    async run(message, args, client) {
        message.channel.send("Hewwo!");
    }
}
```
This would be a basic command that sends the message "Hewwo!" to the Channel. 
In the example above, name would define how the command is run so for this command you would go n>test, whereas "runIn" is a array that defines the the channel types this channel can be run in. Read more on that in the commands section.
Now while this is as basic as it gets, it still goes on with more settings to change and more options to pick from. More on that on the Commands section tho! ;)

## Running the Bot

Now to test it, you can simply start the Bot and see it coming online!

## Bugs, questions, features

You have an idea for a new feature? Or maybe just a bug that you found? Or simply a question? Then please take a look at our Github! You can simply open an issue, write in the discussions or make a pull request and contribute too ^^
