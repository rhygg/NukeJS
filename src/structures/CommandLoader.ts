/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
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
import { Collection, UserResolvable, MessageEmbed } from 'discord.js';
import * as chalk from 'chalk';
import { Client } from '../index';
import Command from '../types/Command';
import NukeLogger from '../utils/NukeLogger';
import Loader from './Loader';

interface commandLoaderOptions {
  directory: string,
  prefix: string,
  name?: string,
  allowMention?: boolean,
  extensions?: Array<string>,
  folderCategory?: boolean,
  logCommands?: boolean,
  handleEditing?: boolean,
  blockBot?: boolean,
  blockClient?: boolean,
  ignoreCooldown?: Array<UserResolvable>,
  ignorePerms?: Array<UserResolvable>,
  ignoredInhibitors?: Array<string>

}

export default class extends Loader {
  directory: string;

  prefix: string;

  name: string;

  allowMention: boolean;

  extensions: Array<string>;

  folderCategory: boolean;

  logCommands: boolean;

  handleEditing: boolean;

  blockBot: boolean;

  blockClient: boolean;

  ignoreCooldown: Array<UserResolvable>;

  ignorePerms: Array<UserResolvable>;

  ignoredInhibitors: Array<string>;

  client: Client;

  Commands: Collection<string, Command> = new Collection<string, Command>();

  Logger: NukeLogger = new NukeLogger();

  constructor(client, options: commandLoaderOptions = { directory: './commands', prefix: 'n>' }) {
    super(client, { directory: options.directory, extensions: options.extensions });
    if (!options.prefix) throw new Error('Property <prefix> cannot be empty in commandLoaderOptions');

    this.directory = `${process.cwd()}/${options.directory}`;
    this.prefix = options.prefix;
    this.client = client;

    this.name = options.name || '';
    this.allowMention = options.allowMention || true;
    this.extensions = options.extensions || ['.js', '.ts'];

    this.folderCategory = options.folderCategory || true;
    this.logCommands = options.logCommands || false;
    this.handleEditing = options.handleEditing || false;
    this.blockBot = options.blockBot || true;
    this.blockClient = options.blockClient || true;
    this.ignoreCooldown = options.ignoreCooldown || [client.owner];
    this.ignorePerms = options.ignorePerms || [];
    this.ignoredInhibitors = options.ignoredInhibitors || [];

    this.init();
  }

  init() {
    console.log(chalk.gray('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'));
    console.log(chalk.gray(`#         Loading commands with prefix: ${this.prefix}           #`));
    console.log(chalk.gray('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'));
    this.fetchAll();
    console.log(chalk.gray('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n'));

    this.client.on('ready', () => {
      this.client.on('message', async (message) => {
        if (message.partial) await message.fetch();
        this.handle(message);
      });
      if (this.handleEditing) {
        this.client.on('messageUpdate', async (o, n) => {
          if (o.partial) await o.fetch();
          if (n.partial) await n.fetch();
          if (o.content === n.content) return;
          this.handle(n);
        });
      }
    });
  }

  register(file: string, path: string, category?: string) {
    try {
      const command: Command = new (require(path))(file);
      if (this.folderCategory && category !== undefined) command.category = category;
      if (!command.enabled) return;
      this.Commands.set(command.name, command);
      this.Logger.LOADED_COMMAND(command);
      this.emit('loaded', { path: command.file });
    } catch (err) {
      if (err instanceof TypeError) {
        this.Logger.MALFORMED_COMMAND(path);
        this.emit('malformed', { path });
      } else {
        console.error(err);
      }
    }
  }

  remove(command: string) {
    if (this.Commands.has(command)) {
      this.Commands.delete(command);
    } else {
      throw new Error(`Command ${command} was never registered!`);
    }
  }

  async checkInihibitors(message, cmd) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      this.client.InhibitorStore.forEach(async (inhibitor) => {
        if (!this.ignoredInhibitors.includes(inhibitor.name)) {
          if ((await inhibitor.run(message, cmd, this.name)) === false) {
            resolve(true);
          }
        } else {
          resolve(false);
        }
      });
      resolve(false);
    });
  }

  async handle(message) {
    let args;
    if (message.content.startsWith(this.prefix)) {
      args = message.content.substring(this.prefix.length).split(/ +/);
    } else if (this.allowMention && message.content.startsWith(`<@${this.client.user.id}>`)) {
      args = message.content.substring(`<@${this.client.user.id}>`.length).split(/ +/);
    } else if (this.allowMention && message.content.startsWith(`<@!${this.client.user.id}>`)) {
      args = message.content.substring(`<@!${this.client.user.id}>`.length).split(/ +/);
    } else return;

    if (args[0] === '' || args[0] === '') args.shift();

    if (args.join('') === '' || args.join('') === ' ' || args.join('') === undefined) return;
    if (this.blockBot && message.author.bot) return;
    if (this.blockClient && message.author.id === this.client.user.id) return;

    const command = args.shift().toLowerCase();
    const cmd = this.Commands.get(command) || this.Commands.find((tempCmd) => tempCmd.aliases.includes(command));

    if (!cmd) return;

    // Inhibitor Check
    // eslint-disable-next-line no-restricted-syntax
    for (const inhibitorKey of this.client.InhibitorStore.keyArray()) {
      if (!this.ignoredInhibitors.includes(inhibitorKey)) {
        if (await this.client.InhibitorStore.get(inhibitorKey).run(message, cmd, this.name) === false) return;
      }
    }

    if (!cmd.runIn.includes(message.channel.type)) return;
    if (cmd.cooldown > 0 && cmd.onCooldown.includes(message.author.id)) {
      message.reply(`You need to wait ${cmd.cooldown / 1000} seconds before using this command again!`);
      return;
    }

    try {
      if (message.channel.type !== 'dm') {
        if (cmd.botPerms.length !== 0) {
          if (!message.guild.member(message.client.user).hasPermission(cmd.botPerms)) {
            message.reply(`Please make sure I have following perms! ${cmd.botPerms.join(', ')}`);
            return;
          }
        }
        if (cmd.userPerms.length !== 0 && !this.ignorePerms.includes(message.author.id)) {
          if (!message.member.hasPermission(cmd.userPerms)) {
            message.reply(`You need following perms to use this command! ${cmd.userPerms.join(', ')}`);
            return;
          }
        }
      }

      await cmd.run(message, args, message.client);
      this.emit('executed', { command: cmd.name });
      if (this.logCommands) this.Logger.LOG_COMMAND(cmd.name, message.user.username, message.guild.name);
      if (cmd.cooldown > 0) {
        cmd.onCooldown.push(message.author.id);
        setTimeout(() => {
          const index = cmd.onCooldown.indexOf(message.author.id);
          if (index > -1) {
            cmd.onCooldown.splice(index, 1);
          }
        }, cmd.cooldown);
      }
    } catch (error) {
      console.error(error);
      const errorEmbed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setTitle('An Error has occurred!')
        .setDescription(`Command failed to with error:\n\n${error.message}`)
        .setColor('#ee110f');
      message.channel.send(errorEmbed);

      this.emit('error', { command: cmd.name, error });
    }
  }
}
