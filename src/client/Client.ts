/**
 * 
 *   NukeJS -- A Discord Bot Framework
 *   Copyright (C) 2021 Nikan Roosta Azad
 * 
 *                  This file is part of NukeJS.
 *
 *   NukeJS is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   NukeJS is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with NukeJS.  If not, see <https://www.gnu.org/licenses/>.
 */

import discord = require("discord.js");
import chalk = require("chalk");
import fs = require("fs");
import { Inhibitor } from "../types/Inhibitor";

const messagePrefix = `${chalk.gray('[')}${chalk.magentaBright('NukeJS Bot Client')}${chalk.gray(']')}`


interface NukeClientOptions {
  discordOptions?: discord.ClientOptions,
  eventsFolder?: string,
  langsFolder?: string,
  readyMessage?: string,
  errorLog?: string,
  owner?: string,
  dev_ids?: Array<string>
}

export class Client extends discord.Client {
  public commandsFolder: string;
  public prefix: string;
  public eventsFolder: string;
  public readyMessage: string;
  public owner: string;
  public dev_ids: string[];
  public InhibitorStore: discord.Collection<string, Inhibitor> = new discord.Collection<string, Inhibitor>();

  public commands: discord.Collection<string, object> = new discord.Collection();
  public events: discord.Collection<string, object> = new discord.Collection();;

  constructor(options: NukeClientOptions) {
    super(options.discordOptions);

    this.eventsFolder = options.eventsFolder || './events';
    this.readyMessage = options.readyMessage || 'I have been started with the name {username}';
    this.owner = options.owner || "";
    this.dev_ids = options.dev_ids || [];
    if (!this.dev_ids.includes(this.owner) && this.owner != "") this.dev_ids.push(this.owner);

    this.on('ready', function () {
      let msg = `${messagePrefix} ${this.readyMessage}`;
      msg = msg.split('{username}').join(chalk.greenBright(this.user.username));
      msg = msg.split('{usertag}').join(chalk.greenBright(this.user.tag));
      msg = msg.split('{userid}').join(chalk.greenBright(this.user.id));
      msg = msg.split('{guildcount}').join(chalk.greenBright(this.guilds.cache.size));

      if (msg.includes('{guilds}')) {
        let guilds = [];
        this.guilds.cache.each(guild => {
          guilds.push(guild.name);
        });
        msg = msg.split('{guilds}').join(chalk.greenBright(guilds.join(chalk.redBright(','))));
      }
      console.log(msg);
    })

  }
}



interface Command {
  enabled?: boolean,
  runIn?: Array<string>,
  cooldown?: number,
  aliases?: Array<string>,
  botPerms?: Array<discord.BitFieldResolvable<discord.PermissionString>>,
  userPerms?: Array<discord.BitFieldResolvable<discord.PermissionString>>,
  name: string,
  description?: string,
  extendedHelp?: string,
  usage?: string,
  category?: string,
  file: string;
}

function checkCommand(command: Command) {
  const perms = discord.Permissions;
  try {
    perms.resolve(command.botPerms);
  } catch (err) {
    if (err instanceof RangeError) console.log(messagePrefix + ` BotPerms of ${chalk.blueBright(command.name)} invalid! Command ${chalk.blueBright(command.name)} will be skipped!`);
    return false;
  }
  try {
    perms.resolve(command.userPerms);
  } catch (err) {
    if (err instanceof RangeError) console.log(messagePrefix + ` UserPerms of ${chalk.blueBright(command.name)} invalid! Command ${chalk.blueBright(command.name)} will be skipped!`);
    return false;
  }
  return true;
}
