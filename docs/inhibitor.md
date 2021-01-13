# Inhibitor
Inhibitors are like blockers that run before a command is actually executed. This can be useful if you want to make costum bot perms checks or maybe have a blacklist. 

```js
const {Inhibitor} = require('nukejs')

module.exports = class extends Inhibitor {
    constructor() {
        super({
            name: "blacklist",
            enabled: true
        })
    }

    async run(message, command, loaderName) {
       const blacklist = ["731670025873915965"]
       return blacklist.includes(message.author.id)
    }
}
```

In the run parameters, message returns the received message, command is the Command the User run in form of a Command object. The loaderName is the name of the loader the command that is being executed is run in. Keep in mind if you didn't define a name for the loader, that parameter will be "".