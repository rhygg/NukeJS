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

import * as discord from 'discord.js';
import * as chalk from 'chalk';
import Inhibitor from '../types/Inhibitor';

const messagePrefix = `${chalk.gray('[')}${chalk.magentaBright('NukeJS Bot Client')}${chalk.gray(']')}`;

interface NukeClientOptions {
  discordOptions?: discord.ClientOptions,
  eventsFolder?: string,
  langsFolder?: string,
  readyMessage?: string,
  errorLog?: string,
  owner?: string,
  devIds?: Array<string>
}

export default class extends discord.Client {
  public commandsFolder: string;

  public prefix: string;

  public eventsFolder: string;

  public readyMessage: string;

  public owner: string;

  public devIds: string[];

  public InhibitorStore: discord.Collection<string, Inhibitor> = new discord.Collection<string, Inhibitor>();

  public commands: discord.Collection<string, object> = new discord.Collection();

  public events: discord.Collection<string, object> = new discord.Collection();;

  constructor(options: NukeClientOptions) {
    super(options.discordOptions);

    this.eventsFolder = options.eventsFolder || './events';
    this.readyMessage = options.readyMessage || 'I have been started with the name {username}';
    this.owner = options.owner || '';
    this.devIds = options.devIds || [];
    if (!this.devIds.includes(this.owner) && this.owner !== '') this.devIds.push(this.owner);

    this.on('ready', () => {
      let msg = `${messagePrefix} ${this.readyMessage}`;
      msg = msg.split('{username}').join(chalk.greenBright(this.user.username));
      msg = msg.split('{usertag}').join(chalk.greenBright(this.user.tag));
      msg = msg.split('{userid}').join(chalk.greenBright(this.user.id));
      msg = msg.split('{guildcount}').join(chalk.greenBright(this.guilds.cache.size));

      if (msg.includes('{guilds}')) {
        const guilds = [];
        this.guilds.cache.each((guild) => {
          guilds.push(guild.name);
        });
        msg = msg.split('{guilds}').join(chalk.greenBright(guilds.join(chalk.redBright(','))));
      }
      console.log(msg);
    });
  }
}
