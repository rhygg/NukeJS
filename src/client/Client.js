const discord = require('discord.js')
const fs = require('fs')

class Client extends discord.Client{
    /**
     * 
     * @param {NukeClientOptions} [options] Options for the client
     */
    constructor(options = {}) {
        super(options.discordOptions)

        this.commandsFolder = options.commandsFolder || './commands'
        this.prefix = options.prefix || 'n>'
        super.prefix = this.prefix
        this.eventsFolder = options.eventsFolder || './events'
        this.readMessage = options.readyMessage || 'I have been started with the name {username}'
        this.errorLog = options.errorLog || undefined

        this.commands = new discord.Collection();


        this.on('ready', function() {
            let msg = `[NukeJS Bot Client] ${this.readMessage}`
            msg = msg.split('{username}').join(this.user.username)
            msg = msg.split('{usertag}').join(this.user.tag)
            msg = msg.split('{userid}').join(this.user.id)
            let guilds = []
            if(msg.includes('{guilds}')) {
                this.guilds.cache.each(guild => {
                    guilds.push(guild.name)
                })
            }
            msg = msg.split('{guilds}').join(guilds.join(','))
            console.log(msg)
        })

        var commandsDir = fs.readdirSync(this.commandsFolder)
        for(var file of commandsDir) {
            if(file.endsWith('.js')) {
                const command = new (require(`${process.cwd()}/${this.commandsFolder}/${file}`))(file)
                this.commands.set(command.name,command)
            }else {
                if(fs.lstatSync(`${process.cwd()}/${this.commandsFolder}/${file}`).isDirectory()) {
                    var categoryCommands = fs.readdirSync(`${process.cwd()}/${this.commandsFolder}/${file}`).filter(file => file.endsWith('.js'))
                    for(var rawCategoryCommand of categoryCommands) {
                        const command = new (require(`${process.cwd()}/${this.commandsFolder}/${file}/${rawCategoryCommand}`))(rawCategoryCommand)
                        command.category = file
                        this.commands.set(command.name,command)
                    }
                }
            }
        }

        console.log(this.commands)


        //++++++++++++++++++++++++++++++++++++++
        //     Internal Events
        //++++++++++++++++++++++++++++++++++++++

        var internalEventsDir = fs.readdirSync(`${__dirname}/../events/`)
        for(var internalEventFile of internalEventsDir) {
            const internalEvent = new (require(`${__dirname}/../events/${internalEventFile}`))()
            this.on(internalEvent.name,internalEvent.run)
        }

    }

    
}
module.exports = Client