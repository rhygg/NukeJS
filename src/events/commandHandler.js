const {Event} = require(`../index`)
console.log(Event)

module.exports = class extends Event {
    constructor() {
        super({name:'message'})
    }

    async run(message) {
        if(message.author.bot || !message.content.startsWith(message.client.prefix)) return;

        const args = message.content.slice(message.client.prefix.length).split(/ +/)
        const command = args.shift().toLowerCase()

        const cmd = message.client.commands.get(command) || message.client.commands.find(cmd => cmd.aliases.lncludes(command))

        if(!cmd) return

        try {
            cmd.run(message,args,message.author,message.client)
        }catch(error) {
            console.log(error)
            message.reply('A Fatal error occured, please contact an Bot admin!')
        }
    }
}