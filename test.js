const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'no';

const PREFIX = '-'

var version = '1.0.1'

bot.on('ready', () => {
    console.log('This bot is online!');
})

bot.on('message', msg => {

    let args = msg.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'ping':
            msg.channel.send('pong!')
            break;
        case 'website':
            msg.channel.send('fliasc.unaux.com')
            break;
        case 'info':
            if (args[1] === 'version') {
                msg.channel.send('Version ' + version)
            } else
            if (args[1] === 'author') {
                msg.channel.send('The author is a person whos doing coding as a hobby and made this bot entirely for fun')
            } else {
                msg.channel.send('Invalid Argument')
            }
            break;

        case 'kick':
            if (!args[1]) msg.channel.send('Please specify a valid user!')

            const user = msg.mentions.members.first();

            if (user) {
                const member = msg.guild.members.cache.get(user.id)

                if (member) {
                    member.kick('You are kicked from the server!').then(() => {
                        msg.reply(`Succesfully kicked ${user.tag}`)
                    }).catch(err => {
                        msg.reply("I was unable to kick the user");
                        console.log(err);
                    });
                } else {
                    msg.reply("That user isn/'t on this guild")
                }
            } else {
                msg.reply('That user isnt on the guild')
            }

            break;

    }
});

bot.login(token);