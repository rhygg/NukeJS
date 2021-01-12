const chalk = require("chalk")
const messagePrefix = `${chalk.gray('[')}${chalk.magentaBright('NukeJS Bot Client')}${chalk.gray(']')}`

export class NukeLogger {
    constructor() {

    }

    MALFORMED_COMMAND(path) {
        console.log(`${messagePrefix} ${chalk.redBright(`Malformed external command at ${chalk.blueBright(path)}`)}`)
    }

    LOADED_COMMAND(command) {
        console.log(`${messagePrefix} Loaded external command ${chalk.greenBright(command.name)}`);
    }

    REMOVED_COMMAND(command) {
        console.log(`${messagePrefix} ${chalk.redBright(`Removed Command ${chalk.blueBright(command)}`)}`)
    }

    LOG_COMMAND(commandName, userName, guildName) {
        console.log(`${messagePrefix} Command ${chalk.blueBright(commandName)} has been run by ${userName} in ${guildName}`);
    }
}