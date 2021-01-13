# Commands
To create a Command, you need to input this into a new js file that is located in the command directory you set the Loader to!

```js
const { Command } = require('nukejs')

module.exports = class extends Command {
    constructor(file) {
        super(file, {
            name: "",
            runIn: ""
        })
    }

    async run(message, args, client) {
        
    }
}```

## Parameter

Option | Input | Function | default
------------ | ------------- | ------------- | --------
name | string | The name of your command | ""
runIn | Array<string> ["text","dm"] | Sets, in which channels the command should be able to be runned in | ["text", "dm"]
cooldown | number | Sets a cooldown for the command in milliseconds | 0
aliases | Array<string> | The alternative names for the command | []
botPerms | Array<PermissionResolvable> | An Array of permissions, needed by the Bot to run this command | []
userPerms | Array<PermissionResolvable> | An Array of permissions, needed by the User to run this command | []
description | string | The description of the command that will be displayed by the dynamic help command | ""
usage | string | The information of how to run the command, also displayed in the dynamic help command | ""
