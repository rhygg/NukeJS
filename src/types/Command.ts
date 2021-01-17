/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
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

import { BitFieldResolvable, PermissionString } from 'discord.js';

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
export default class {
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
    if (this.enabled === undefined) this.enabled = true;
    if (!this.enabled) return;

    this.runIn = options.runIn || ['text', 'dm'];

    this.cooldown = Math.abs(options.cooldown) || 0;

    if (this.cooldown > 0) this.onCooldown = [];

    this.aliases = options.aliases || [];

    this.botPerms = options.botPerms || [];

    this.userPerms = options.userPerms || [];

    this.name = options.name || file.substring(0, file.length - 3);

    this.description = options.description || '';

    this.extendedHelp = options.extendedHelp || this.description;

    this.usage = options.usage || '';

    this.file = file;
  }

  /**
     * @param {Message} msg The message that led to triggering this command
     * @param {Array<string>} args The args of the command
     * @param {client} client The client of the Bot
     */
  async run(message, args, client) {}
}
