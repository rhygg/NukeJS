const { Command } = require('../index')
const discord = require('discord.js')
const fs = require('fs')
const chalk = require('chalk')
const messagePrefix = `${chalk.gray('[')}${chalk.magentaBright('NukeJS Bot Client')}${chalk.gray(']')}`

module.exports = class extends Command {
    constructor(file) {
        super(file, {
            name: "reload"
        })
    }

    async run(msg, args, executor, client) {
        console.log("OwO")
        console.log(msg.client.dev_ids)
        if (msg.client.dev_ids.includes(msg.author.id)) {
            console.log("UwU")
            msg.client.commands.clear()
            var commandsDir = fs.readdirSync(msg.client.commandsFolder)
        console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))

        //++++++++++++++++++++++++++++++++++++++
        //     External Commands
        //++++++++++++++++++++++++++++++++++++++
        const perms = discord.Permissions
        for (var file of commandsDir) {
            try {
                if (file.endsWith('.js')) {
                    const command = new(require(`${process.cwd()}/${msg.client.commandsFolder}/${file}`))(file)
                    if(!command.enabled) continue

                    //Correct checks
                    try{perms.resolve(command.botPerms)} catch(err){if(err instanceof RangeError) console.log(messagePrefix+` BotPerms of ${chalk.blueBright(command.name)} invalid! Command ${chalk.blueBright(command.name)} will be skipped!`); continue;}
                    try{perms.resolve(command.userPerms)} catch(err){if(err instanceof RangeError) console.log(messagePrefix+` UserPerms of ${chalk.blueBright(command.name)} invalid! Command ${chalk.blueBright(command.name)} will be skipped!`); continue;}

                    if(!command.category) command.category = ""
                    this.commands.set(command.name, command)
                    
                    console.log(`${messagePrefix} Loaded external command ${chalk.greenBright(command.name)}`)
                } else {
                    if (fs.lstatSync(`${process.cwd()}/${msg.client.commandsFolder}/${file}`).isDirectory()) {
                        var categoryCommands = fs.readdirSync(`${process.cwd()}/${msg.client.commandsFolder}/${file}`).filter(file => file.endsWith('.js'))
                        for (var rawCategoryCommand of categoryCommands) {
                            try {
                                const command = new(require(`${process.cwd()}/${msg.client.commandsFolder}/${file}/${rawCategoryCommand}`))(rawCategoryCommand)
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
        }
    }
}