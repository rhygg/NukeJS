/*
 * NukeJS - Discordjs Bot Framework
 *
 * Copyright (c) 2021 Nikan Roosta Azad
 * All rights reserved.
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 * to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
const chalk = require("chalk")
const messagePrefix = `${chalk.gray('[')}${chalk.magentaBright('NukeJS Bot Client')}${chalk.gray(']')}`

export class NukeLogger {
    constructor() {

    }

    MALFORMED_COMMAND(path) {
        console.log(`${messagePrefix} ${chalk.redBright(`Malformed command at ${chalk.blueBright(path)}`)}`)
    }

    LOADED_COMMAND(command) {
        console.log(`${messagePrefix} Loaded command ${chalk.greenBright(command.name)}`);
    }

    REMOVED_COMMAND(command) {
        console.log(`${messagePrefix} ${chalk.redBright(`Removed Command ${chalk.blueBright(command)}`)}`)
    }

    LOG_COMMAND(commandName, userName, guildName) {
        console.log(`${messagePrefix} Command ${chalk.blueBright(commandName)} has been run by ${userName} in ${guildName}`);
    }

    LOADED_EVENT(eventFile) {
        console.log(`${messagePrefix} Loaded Event ${chalk.greenBright(eventFile)}`);
    }

    LOADED_INHIBITOR(inhibitor) {
        console.log(`${messagePrefix} Loaded Inhibitor ${chalk.greenBright(inhibitor)}`);
    }
}