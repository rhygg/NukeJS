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
import { Collection, UserResolvable } from "discord.js";
import { Client } from "../index";
import { Command } from "../types/Command";
import * as fs from "fs";
import { NukeLogger } from "../utils/NukeLogger";
const EventEmitter = require('events');
import { MessageEmbed } from "discord.js";
import * as chalk from "chalk";

interface commandLoaderOptions {
  directory: string,
  prefix: string,
  allowMention?: boolean,
  extensions?: Array<string>,
  folderCategory?: boolean,
  logCommands?: boolean,
  handleEditing?: boolean,
  blockBot?: boolean,
  blockClient?: boolean,
  ignoreCooldown?: Array<UserResolvable>,
  ignorePerms?: Array<UserResolvable>,
}

export class CommandLoader extends EventEmitter {
  directory: string;
  prefix: string;
  allowMention: boolean;
  extensions: Array<string>;
  folderCategory: boolean;
  logCommands: boolean;
  handleEditing: boolean;
  blockBot: boolean;
  blockClient: boolean;
  ignoreCooldown: Array<UserResolvable>;
  ignorePerms: Array<UserResolvable>;
  client: Client;
  Commands: Collection<string, Command> = new Collection<string, Command>();
  Logger: NukeLogger = new NukeLogger();

  constructor(client, options: commandLoaderOptions = { directory: "./commands", prefix: "n>" }) {
    super();
    if (!options.directory) throw new Error("Property <directory> cannot be empty in commandLoaderOptions");
    if (!options.prefix) throw new Error("Property <prefix> cannot be empty in commandLoaderOptions");
    if (!(client instanceof Client)) throw new Error("Argument <client> must be a NukeJS instance")

    this.directory = process.cwd() + "/" + options.directory;
    this.prefix = options.prefix;
    this.client = client;

    this.allowMention = options.allowMention || true;
    this.extensions = options.extensions || [".js", ".ts"];
    this.folderCategory = options.folderCategory || true;
    this.logCommands = options.logCommands || false;
    this.handleEditing = options.handleEditing || false;
    this.blockBot = options.blockBot || true;
    this.blockClient = options.blockClient || true;
    this.ignoreCooldown = options.ignoreCooldown || [client.owner];
    this.ignorePerms = options.ignorePerms || [];

    this.init();
  }

  init() {
    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))
    console.log(chalk.gray(`#         Loading commands with prefix: ${this.prefix}           #`))
    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))
    this.fetchAllCommands();
    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n`))
    
    this.client.on("ready", () => {
      this.client.on("message", async message => {
        if (message.partial) await message.fetch();
        this.handle(message)
      })
      if (this.handleEditing) {
        this.client.on("messageUpdate", async (o, n) => {
          if (o.partial) await o.fetch();
          if (n.partial) await n.fetch();
          if (o.content === n.content) return;
          this.handle(n);
        })
      }
    })
  }

  fetchAllCommands() {
    
    const commandFiles = fs.readdirSync(this.directory);
    commandFiles.forEach(commandFile => {
      if (fs.lstatSync(this.directory + "/" + commandFile).isDirectory()) {
        this.readDirRecursively(this.directory + "/" + commandFile).forEach(file => {
          try {
            const subCommand: Command = new (require(file))(file);
            if (this.folderCategory) subCommand.category = commandFile;
            this.Commands.set(subCommand.name, subCommand);
            this.Logger.LOADED_COMMAND(subCommand);
            this.emit("loaded", { path: file })
          } catch (err) {
            if (err instanceof TypeError) {
              this.Logger.MALFORMED_COMMAND(`${this.directory}/${commandFile}/${file}`);
              this.emit("malformed", { path: `${this.directory}/${commandFile}/${file}` })
            } else {
              console.error(err)
            }
          }
        });
      } else if (fs.lstatSync(this.directory + "/" + commandFile).isFile()) {
        this.extensions.forEach(extension => {
          if (commandFile.endsWith(extension)) {
            try {
              const command: Command = new (require(`${this.directory}/${commandFile}`))(commandFile);
              this.Commands.set(command.name, command);
              this.Logger.LOADED_COMMAND(command);
              this.emit("loaded", { path: `${this.directory}/${commandFile}` })
            } catch (err) {
              if (err instanceof TypeError) {
                this.Logger.MALFORMED_COMMAND(this.directory + "/" + commandFile);
                this.emit("malformed", { path: `${this.directory}/${commandFile}/` })
              } else {
                console.error(err)
              }
            }
          }
        })
      }
      
    })
  }

  remove(command: string) {
    if (this.Commands.has(command)) {
      this.Commands.delete(command);
      this.Logger
    } else {
      throw new Error("Command " + command + " was never registered!")
    }
  }

  readDirRecursively(path: string): Array<string> {
    const items = fs.readdirSync(path)
    let files = []
    items.forEach(item => {
      if (fs.lstatSync(path + "/" + item).isFile()) {
        this.extensions.forEach(extension => {
          if (item.endsWith(extension)) {
            files.push(path + "/" + item);
          }
        })
      } else if (fs.lstatSync(path + "/" + item).isDirectory()) {
        files.push(this.readDirRecursively(path + "/" + item));
      }
    })
    return files
  }


  async handle(message) {
    if (!message.content.startsWith(this.prefix)) return;
    if (this.blockBot && message.author.bot) return;
    if (this.blockClient && message.author.id == this.client.user.id) return;

    const args = message.content.slice(this.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const cmd = message.client.commands.get(command) || message.client.commands.find(cmd => cmd.aliases.includes(command));

    if (!cmd) return;
    if (!cmd.runIn.includes(message.channel.type)) return;
    if (cmd.cooldown > 0 && cmd.onCooldown.includes(message.author.id)) {
      message.reply("You need to wait " + cmd.cooldown / 1000 + " seconds before using this command again!");
      return;
    }

    try {
      if (message.channel.type !== "dm") {
        if (cmd.botPerms.length != 0) {
          if (!message.guild.member(message.client.user).hasPermission(cmd.botPerms)) {
            message.reply(`Please make sure I have following perms! ${cmd.botPerms.join(', ')}`);
            return;
          }
        }
        if (cmd.userPerms.length != 0 && !this.ignorePerms.includes(message.author.id)) {
          if (!message.member.hasPermission(cmd.userPerms)) {
            message.reply(`You need following perms to use this command! ${cmd.userPerms.join(', ')}`);
            return;
          }
        }
      }
      if (cmd.onCooldown.includes(message.author.id) && !this.ignoreCooldown.includes(message.author.id)) throw new Error("You are currently on Cooldown! Please try again later!");
      await cmd.run(message, args, message.client);
      if(this.logCommands) this.Logger.LOG_COMMAND(cmd.name, message.user.username, message.guild.name); 
      if (cmd.cooldown > 0) {
        cmd.onCooldown.push(message.author.id);
        setTimeout(function () {
          const index = cmd.onCooldown.indexOf(message.author.id);
          if (index > -1) {
            cmd.onCooldown.splice(index, 1);
          }

        }, cmd.cooldown)
      }
    } catch (error) {
      console.error(error);
      let errorEmbed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setTitle("An Error has occurred!")
        .setDescription("Command failed to with error:\n\n" + error.message)
        .setColor("#ee110f");

      message.channel.send(errorEmbed);
    }
  }
}