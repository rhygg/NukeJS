const {Event} = require('../index')

module.exports = class extends Event {
    constructor() {
        super({name:"message"})
    }

    async run(message) {
        if(message.mentions.members.size > 0) {
            if(message.mentions.members.has(message.client.user.id)) {
                message.reply("My prefix is: "+message.client.prefix)
            }
        }
    }
}