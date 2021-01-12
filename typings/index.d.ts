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

declare module 'nukejs' {
    import { ClientOptions, Client as DiscordClient, UserResolvable } from "discord.js"

    interface NukeClientOptions {
        discordOptions?: ClientOptions,
        commandsFolder?: string,
        eventsFolder?: string,
        langsFolder?: string,
        prefix: string,
        readyMessage?: string,
        errorLog?: string,
        owner?: string,
        dev_ids?: Array<string>
    }

    interface CommandOptions {
        enabled?: boolean,
        runIn?: Array<string>,
        cooldown?: number,
        aliases?: Array<string>,
        botPerms?: Array<string>,
        userPerms?: Array<string>,
        name: string,
        description?: string,
        extendedHelp?: string,
        usage?: string,
        category: string
    }
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
        defaultCommandOptions?: CommandOptions,
      }

    interface EventOptions {
        name: string,
        enabled?: boolean
    }

    export class Client extends DiscordClient{
        constructor(options?:NukeClientOptions)
    }

    export class Command {
        constructor(file?:string,options?:CommandOptions)
    }

    export class Event {
        constructor(options:EventOptions)
    }

    export class CommandLoader {
        constructor(options:commandLoaderOptions)
    }

}