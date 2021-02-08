/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
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

declare module 'nukejs' {
  import {
    Collection, ClientOptions, Client as DiscordClient, UserResolvable, PermissionResolvable, PermissionString, BitFieldResolvable, Message,
  } from 'discord.js';

  interface NukeClientOptions {
    discordOptions?: ClientOptions,
    eventsFolder?: string,
    readyMessage?: string,
    owner?: string,
    devIds?: Array<string>
  }

  interface CommandOptions {
    enabled?: boolean,
    runIn?: ('text' | 'dm')[],
    cooldown?: number,
    aliases?: Array<string>,
    botPerms?: Array<PermissionResolvable>,
    userPerms?: Array<PermissionResolvable>,
    name: string,
    description?: string,
    extendedHelp?: string,
    usage?: string,
    ignoredInhibitors?: Array<string>,
    category?: string
  }
  interface commandLoaderOptions {
    directory: string,
    prefix: string | ((message: Message) => string | Promise<string>),
    allowMention?: boolean,
    extensions?: Array<string>,
    folderCategory?: boolean,
    logCommands?: boolean,
    handleEditing?: boolean,
    blockBot?: boolean,
    blockClient?: boolean,
    ignoreCooldown?: Array<UserResolvable>,
    ignorePerms?: Array<UserResolvable>,
    ignoredInhibitors?: Array<string>,
    errorOutput?: boolean;
  }

  interface InhibitorOptions {
    name: string,
    enabled?: boolean
  }

  interface EventLoaderOptions {
    directory: string,
    extensions?: Array<string>
  }
  interface EventOptions {
    name: string,
    enabled?: boolean
  }

  export class Client extends DiscordClient {
    constructor(options?: NukeClientOptions)
  }

  export class Command {
    enabled: boolean;

    runIn: string[];

    cooldown: number;

    onCooldown: string[];

    aliases: string[];

    botPerms: Array<BitFieldResolvable<PermissionString>>;

    userPerms: Array<BitFieldResolvable<PermissionString>>;

    name: string;

    description: string;

    extendedHelp: string;

    usage: string;

    category: string;

    file: string;

    constructor(file?: string, options?: CommandOptions)

    run(message, args, client);
  }

  export class Event {
    name: string;

    enabled: boolean;

    constructor(options: EventOptions)
  }

  export class Inhibitor {
    name: string;

    enabled: boolean;

    constructor(options: InhibitorOptions)

    run(message: string, command: Command, loaderName: string);
  }

  export class CommandLoader {
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

    Commands: Collection<string, Command>;

    errorOutput: boolean;

    constructor(client: Client, options: commandLoaderOptions)
  }
  export class EventLoader {
    constructor(client: Client, options: EventLoaderOptions)
  }

}
