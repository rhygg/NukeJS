# Event
Just like Commands, you need to create a new JS file in the Events directory you let in the Loader and fill in the following

```js
const {Event} = require('nukejs')

module.exports = class extends Event {
    constructor() {
        super({
            name: "message",
            enabled: true
        })
    }

    async run(parameters...) {
       
    }
}
```

The parameter in the run command is equal to the parameters you would get in a djs Event. As an example a message command would be:

```js
const {Event} = require('nukejs')

module.exports = class extends Event {
    constructor() {
        super({
            name: "message",
            enabled: true
        })
    }

    async run(message) {
       
    }
}
```

Where as a guildCreate would be:

```js
const {Event} = require('nukejs')

module.exports = class extends Event {
    constructor() {
        super({
            name: "guildCreate",
            enabled: true
        })
    }

    async run(guild) {
       
    }
}
```