import { BitFieldResolvable, PermissionString } from "discord.js";

interface CommandOptions {
  enabled?: boolean,
  runIn?: Array<string>,
  cooldown?: number,
  aliases?: Array<string>,
  botPerms?: Array<BitFieldResolvable<PermissionString>>,
  userPerms?: Array<BitFieldResolvable<PermissionString>>,
  name: string,
  description?: string,
  extendedHelp?: string,
  usage?: string,
  category?: string,
}
class Command {
  public enabled: boolean;
  public runIn: string[];
  public cooldown: number;
  public onCooldown: string[];
  public aliases: string[];
  public botPerms: Array<BitFieldResolvable<PermissionString>>;
  public userPerms: Array<BitFieldResolvable<PermissionString>>;
  public name: string;
  public description: string;
  public extendedHelp: string;
  public usage: string;
  public category: string;
  public file: string;

  constructor(file: string, options: CommandOptions) {
    this.enabled = options.enabled;
    if (!this.enabled) return;
    	
    this.runIn = options.runIn || ["text", "dm"];
    
    this.cooldown = Math.abs(options.cooldown) || 0;
    
    if (this.cooldown > 0) this.onCooldown = [];
    
    this.aliases = options.aliases || [];

    this.botPerms = options.botPerms || [];

    this.userPerms = options.userPerms || []

    this.name = options.name || file.substring(0,file.length-3)

    this.description = options.description || ""

    this.extendedHelp = options.extendedHelp || this.description

    this.usage = options.usage || ""

    this.file = file
  }

  /**
     * @param {Message} msg The message that led to triggering this command
     * @param {Array<string>} args The args of the command
     * @param {client} client The client of the Bot
     */
  async run() {}
}
module.exports = Command