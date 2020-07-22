const discord = require('discord.js')
const fs = require('fs')
const chalk = require('chalk')
const {
    cpuUsage
} = require('process')
const messagePrefix = `${chalk.gray('[')}${chalk.magentaBright('NukeJS Bot Client')}${chalk.gray(']')}`

class Client extends discord.Client {
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
        this.events = new discord.Collection();


        this.on('ready', function () {
            let msg = `${messagePrefix} ${this.readMessage}`
            msg = msg.split('{username}').join(chalk.greenBright(this.user.username))
            msg = msg.split('{usertag}').join(chalk.greenBright(this.user.tag))
            msg = msg.split('{userid}').join(chalk.greenBright(this.user.id))
            msg = msg.split('{guildcount}').join(chalk.greenBright(this.guilds.cache.size))
            let guilds = []
            if (msg.includes('{guilds}')) {
                this.guilds.cache.each(guild => {
                    guilds.push(guild.name)
                })
            }
            msg = msg.split('{guilds}').join(chalk.greenBright(guilds.join(chalk.redBright(','))))
            console.log(msg)
        })

        var commandsDir = fs.readdirSync(this.commandsFolder)
        console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))

        //++++++++++++++++++++++++++++++++++++++
        //     External Commands
        //++++++++++++++++++++++++++++++++++++++
        const perms = discord.Permissions
        for (var file of commandsDir) {
            try {
                if (file.endsWith('.js')) {
                    const command = new(require(`${process.cwd()}/${this.commandsFolder}/${file}`))(file)
                    if(!command.enabled) continue

                    //Correct checks
                    try{perms.resolve(command.botPerms)} catch(err){if(err instanceof RangeError) console.log(messagePrefix+` BotPerms of ${chalk.blueBright(command.name)} invalid! Command ${chalk.blueBright(command.name)} will be skipped!`); continue;}
                    try{perms.resolve(command.userPerms)} catch(err){if(err instanceof RangeError) console.log(messagePrefix+` UserPerms of ${chalk.blueBright(command.name)} invalid! Command ${chalk.blueBright(command.name)} will be skipped!`); continue;}

                    if(!command.category) command.category = ""
                    this.commands.set(command.name, command)
                    
                    console.log(`${messagePrefix} Loaded external command ${chalk.greenBright(command.name)}`)
                } else {
                    if (fs.lstatSync(`${process.cwd()}/${this.commandsFolder}/${file}`).isDirectory()) {
                        var categoryCommands = fs.readdirSync(`${process.cwd()}/${this.commandsFolder}/${file}`).filter(file => file.endsWith('.js'))
                        for (var rawCategoryCommand of categoryCommands) {
                            try {
                                const command = new(require(`${process.cwd()}/${this.commandsFolder}/${file}/${rawCategoryCommand}`))(rawCategoryCommand)
                                if(!command.enabled) continue
                                //perm checks
                                try{perms.resolve(command.botPerms)} catch{console.log(messagePrefix+` BotPerms of ${chalk.blueBright(command.name)} invalid! Command ${chalk.blueBright(command.name)} will be skipped!`); continue;}
                                try{perms.resolve(command.userPerms)} catch(err){if(err instanceof RangeError) console.log(messagePrefix+` UserPerms of ${chalk.blueBright(command.name)} invalid! Command ${chalk.blueBright(command.name)} will be skipped!`); continue;}

                                if(!command.category) command.category = file
                                this.commands.set(command.name, command)
                                console.log(`${messagePrefix} Loaded external command ${chalk.greenBright(command.name)}`)
                            } catch (err) {
                                if (err instanceof TypeError) {
                                    console.log(`${messagePrefix} ${chalk.redBright(`Malformed external command at ${chalk.blueBright(rawCategoryCommand)}`)}`)
                                } else {
                                    console.log(err)
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                if (err instanceof TypeError) {
                    console.log(`${messagePrefix} ${chalk.redBright(`Malformed external command at ${chalk.blueBright(file)}`)}`)
                } else {
                    console.log(err)
                }
            }
        }

        //++++++++++++++++++++++++++++++++++++++
        //     Internal Commands
        //++++++++++++++++++++++++++++++++++++++
        var commandsDir = fs.readdirSync(`${__dirname}/../commands`)
        for (var file of commandsDir) {
            try {
                if (file.endsWith('.js')) {
                    const command = new(require(`${__dirname}/../commands/${file}`))(file)
                    if (this.commands.has(command.name)) {
                        console.log(`${messagePrefix} skipping internal command ${chalk.greenBright(command.name)}`);
                        continue;
                    }

                    this.commands.set(command.name, command)
                    console.log(`${messagePrefix} Loaded internal command ${chalk.greenBright(command.name)}`)
                } else {
                    if (fs.lstatSync(`${__dirname}/../commands/${file}`).isDirectory()) {
                        var categoryCommands = fs.readdirSync(`${__dirname}/../commands/${file}`).filter(file => file.endsWith('.js'))
                        for (var rawCategoryCommand of categoryCommands) {
                            try {
                                const command = new(require(`${__dirname}/../commands/${file}/${rawCategoryCommand}`))(rawCategoryCommand)
                                if (this.commands.has(command.name)) {
                                    console.log(`${messagePrefix} skipping internal command ${chalk.greenBright(command.name)}`);
                                    continue;
                                }

                                command.category = file
                                this.commands.set(command.name, command)
                                console.log(`${messagePrefix} Loaded internal command ${chalk.greenBright(command.name)}`)
                            } catch (err) {
                                console.log(err)
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
        console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))
        console.log(chalk.gray(`#                           Events                               #`))
        console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))
        //++++++++++++++++++++++++++++++++++++++
        //     External Events
        //++++++++++++++++++++++++++++++++++++++
        var externalEventsDir = fs.readdirSync(`${process.cwd()}/${this.eventsFolder}`)
        for (var externalEventFile of externalEventsDir) {
            try {
                const externalEvent = new(require(`${process.cwd()}/${this.eventsFolder}/${externalEventFile}`))()
                this.on(externalEvent.name, externalEvent.run)
                externalEvent.file = externalEventFile
                this.events.set(externalEvent.file, externalEvent)
                console.log(`${messagePrefix} Loaded external events ${chalk.greenBright(externalEventFile)}`)
            } catch (err) {
                if (err instanceof TypeError) {
                    console.log(`${messagePrefix} ${chalk.redBright(`Malformed external Event at ${chalk.blueBright(externalEventFile)}`)}`)
                } else {
                    console.log(err)
                }
            }
        }

        //++++++++++++++++++++++++++++++++++++++
        //     Internal Events
        //++++++++++++++++++++++++++++++++++++++
        var internalEventsDir = fs.readdirSync(`${__dirname}/../events/`)
        for (var internalEventFile of internalEventsDir) {
            try {
                if (this.events.has(internalEventFile)) {
                    console.log(`${messagePrefix} skipping internal event ${chalk.greenBright(internalEventFile)}`);
                    continue;
                }
                const internalEvent = new(require(`${__dirname}/../events/${internalEventFile}`))()
                this.on(internalEvent.name, internalEvent.run)
                internalEvent.file = internalEventFile
                this.events.set(internalEvent.file, internalEvent)
                console.log(`${messagePrefix} Loaded internal events ${chalk.greenBright(internalEventFile)}`)
            } catch (err) {
                console.log(err)
            }
        }
        console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))

    }


}
module.exports = Client