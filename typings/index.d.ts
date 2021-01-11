declare module 'nukejs' {
    import { ClientOptions } from "discord.js"

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

    interface EventOptions {
        name: string,
        enabled?: boolean
    }

    export class Client {
        constructor(options?:NukeClientOptions)
    }

    export class Command {
        constructor(file?:string,options?:CommandOptions)
    }

    export class Event {
        constructor(options:EventOptions)
    }

}