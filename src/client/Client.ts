import discord = require("discord.js");
import chalk = require("chalk");
import fs = require("fs");

const messagePrefix = `${chalk.gray('[')}${chalk.magentaBright('NukeJS Bot Client')}${chalk.gray(']')}`


interface NukeClientOptions {
  discordOptions?: discord.ClientOptions,
  commandsFolder?: string,
  eventsFolder?: string,
  langsFolder?: string,
  prefix: string,
  readyMessage?: string,
  errorLog?: string,
  owner?: string,
  dev_ids?: Array<string>
}

class Client extends discord.Client {
  public commandsFolder: string;
  public prefix: string;
  public eventsFolder: string;
  public readyMessage: string;
  public owner: string;
  public dev_ids: string[];

  public commands: discord.Collection<string, object> = new discord.Collection();
  public events: discord.Collection<string, object> = new discord.Collection();;

  constructor(options: NukeClientOptions) {
    super(options.discordOptions);

    this.commandsFolder = options.commandsFolder || './commands';
    this.prefix = options.prefix || 'n>';
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

    let externalCommandsDir = fs.readdirSync(this.commandsFolder);
    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))

    //++++++++++++++++++++++++++++++++++++++
    //     External Commands
    //++++++++++++++++++++++++++++++++++++++
    try {
      for (let file of externalCommandsDir) {
        try {
          if (file.endsWith(".js")) {
            const command = new (require(`${process.cwd()}/${this.commandsFolder}/${file}`))(file);
            if (!command.enabled) continue;

            if (!checkCommand(command)) continue;

            this.commands.set(command.name, command);

            console.log(`${messagePrefix} Loaded external command ${chalk.greenBright(command.name)}`)
          } else {
            if (fs.lstatSync(file).isDirectory()) {
              const subFolderCommands = fs.readdirSync(`${process.cwd()}/${this.commandsFolder}/${file}`).filter(file => file.endsWith(".js"))
              for (let subFolderFile of subFolderCommands) {
                try {
                  const subFolderCommand = new (require(`${process.cwd()}/${this.commandsFolder}/${file}/${subFolderFile}`))(subFolderFile);
                  if (!subFolderCommand.enabled) continue;
                  if (!checkCommand(subFolderCommand)) continue;

                  if (!subFolderCommand.category) subFolderCommand.category = file;
                  this.commands.set(subFolderCommand.name, subFolderCommand);
                  console.log(`${messagePrefix} Loaded external command ${chalk.greenBright(subFolderCommand.name)}`)
                } catch (err) {
                  if (err instanceof TypeError) {
                    console.log(`${messagePrefix} ${chalk.redBright(`Malformed external command at ${chalk.blueBright(subFolderFile)}`)}`)
                  } else {
                    console.error(err)
                  }
                }
              }
            }
          }
        } catch (err) {
          if (err instanceof TypeError) {
            console.log(`${messagePrefix} ${chalk.redBright(`Malformed external command at ${chalk.blueBright(file)}`)}`)
          } else {
            console.error(err)
          }
        }
      }
    } catch {
      console.log(`${messagePrefix} ${chalk.redBright("No external Commands defined")}`)
    }

    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))
    console.log(chalk.gray(`#                           Events                               #`))
    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))

    //++++++++++++++++++++++++++++++++++++++
    //     External Events
    //++++++++++++++++++++++++++++++++++++++
    try {
      let externalEventsDir = fs.readdirSync(`${process.cwd()}/${this.eventsFolder}`);
      for (let externalEventFile of externalEventsDir) {
        try {
          const externalEvent = new (require(`${process.cwd()}/${this.eventsFolder}/${externalEventFile}`))()
          if (!externalEvent.enabled) continue;
          this.on(externalEvent.name, externalEvent.run);
          this.events.set(externalEvent.file, externalEvent);
          console.log(`${messagePrefix} Loaded external event ${chalk.greenBright(externalEventFile)}`)
        } catch (err) {
          if (err instanceof TypeError) {
            console.log(`${messagePrefix} ${chalk.redBright(`Malformed external Event at ${chalk.blueBright(externalEventFile)}`)}`)
          } else {
            console.log(err)
          }
        }
      }
    } catch {
      console.log(`${messagePrefix} ${chalk.redBright("No external Events defined")}`)
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
        const internalEvent = new (require(`${__dirname}/../events/${internalEventFile}`))()
        this.on(internalEvent.name, internalEvent.run)
        internalEvent.file = internalEventFile
        this.events.set(internalEvent.file, internalEvent)
        console.log(`${messagePrefix} Loaded internal event ${chalk.greenBright(internalEventFile)}`)
      } catch (err) {
        console.log(err)
      }
    }
    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))
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
module.exports = Client