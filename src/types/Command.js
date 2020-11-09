class Command {
    /**
     * 
     * @param {string} file 
     * @param {CommandOptions} options 
     */
    constructor(file,options = {}) {
        if ((options.enabled != undefined) && (typeof options.enabled === "boolean")) {this.enabled = options.enabled} else{this.enabled = true}

        this.runIn = options.runIn || ['text','dm']

        this.cooldown = Math.abs(options.cooldown) || 0
        
        if(this.cooldown > 0) this.onCooldown = []

        this.aliases = options.aliases || []

        this.botPerms = options.botPerms || []

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
    async run() {

    }
}
module.exports = Command
