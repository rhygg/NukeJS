const {
    Event
} = require(`../index`)
const {
    Permissions
} = require('discord.js')
const chalk = require('chalk')

const messagePrefix = `${chalk.gray('[')}${chalk.magentaBright('NukeJS Bot Client')}${chalk.gray(']')}`

module.exports = class extends Event {
    constructor() {
        super({
            name: 'message'
        })
    }

    async run(message) {
        if (message.author.bot || !message.content.startsWith(message.client.prefix)) return;

        const args = message.content.slice(message.client.prefix.length).split(/ +/)
        const command = args.shift().toLowerCase()
        const cmd = message.client.commands.get(command) || message.client.commands.find(cmd => cmd.aliases.includes(command))

        if (!cmd) return
        if (message.channel.type !== cmd.runIn) return;
        if (cmd.cooldown > 0 && cmd.onCooldown.includes(message.author.id)) {
            message.reply("You need to wait " + cmd.cooldown / 1000 + " seconds before using this command again!");
            return;
        }

        try {
            if (message.channel.type !== "dm") {
                if (cmd.botPerms.length != 0) {
                    if (!message.guild.member(message.client.user).hasPermission(cmd.botPerms)) {
                        message.reply(`Please make sure I have following perms! ${cmd.botPerms.join(', ')}`)
                        return
                    }
                }
                if (cmd.userPerms.length != 0) {
                    if (!message.member.hasPermission(cmd.userPerms)) {
                        message.reply(`You need following perms to use this command! ${cmd.userPerms.join(', ')}`)
                        return
                    }
                }
            }
            await cmd.run(message, args, message.client)
            if (cmd.cooldown > 0) {
                cmd.onCooldown.push(message.author.id)
                setTimeout(function () {
                    const index = cmd.onCooldown.indexOf(message.author.id);
                    if (index > -1) {
                        cmd.onCooldown.splice(index, 1);
                    }

                }, cmd.cooldown)
            }
        } catch (error) {
            console.log(error)
            message.reply('A Fatal error occured, please contact an Bot admin!')
        }
    }
}