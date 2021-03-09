const {Beautify, Color} = require("callista");
const fs = require("fs");
const fse = require("fs-extra");
const cp = require("child_process");
const symbols = require("log-symbols");

class Actions {

    constructor(path = ".", source = null, clearPrevious = false) {
        this.path = path || ".";
        this.source = source;
        this.ClearPrevious = !!clearPrevious;
    }

    initGit() {
        const commands = ["git init", "git add .", "git commit -m \"create discord bot\""];
        const finalizingLoader = Beautify.spinner(Color.brightBlue("Finalizing...")).start();

        for (const command of commands) {
            try {
                cp.execSync(this.path === "." ? command : `cd ${this.path} && ${command}`);
            } catch(e) { /* Do nothing */ }
        }

        finalizingLoader.succeed(Color.greenBright("Successfully created"+Color.blue("NukeJs Bot Project!")));
    }

    async init(token = null, ops = { language: null }) {
        if (!!this.clearPrevious) console.log(symbols.warning, Color.brightYellow("You are using clear previous to override the previous data, I hope you know what your doing!"));
        if (!this.source) return console.log(symbols.error, Color.brightRed("No source file(s) specified!"));
        let path = this.path === "." ? process.cwd() : `${process.cwd()}/${this.path}`;
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        if (fs.readdirSync(path).length !== 0 && !this.clearPrevious) return console.log(symbols.error, Color.brightRed("The Mentioned directory is not empty use "+Color.magenta("--clearPrevious")+" To override!"));
        else if (!!this.clearPrevious && fs.readdirSync(path).length !== 0) {
            console.log(symbols.warning, Color.brightYellow("Using --clearPrevious, Content found in the specified dir, clearing..."));
            fse.emptyDirSync(path);
            console.log(symbols.success, Color.greenBright("Directory cleared successfully!"));
        }

        fs.readdir(this.source, async (error, files) => {
            if (error) return console.log(symbols.error, Color.brightRed(error.message));

            const copyFileLoader = Beautify.spinner(Color.brightCyan("Copying files...")).start();

            for (const file of files) {
                await fse.copy(`${this.source}/${file}`, `${path}/${file}`);
                await fse.writeFile(path.endsWith("/") ? path + ".env" : path + "/.env", `TOKEN=${token && typeof token === "string" ? token : "ENTER_YOUR_BOT_TOKEN"}`);
                await fse.writeFile(path.endsWith("/") ? path + ".gitignore" : path + "/.gitignore", "node_modules/\npackage-lock.json\n.env");
            }

            copyFileLoader.succeed(Color.brightCyan("Finished copying files!"));
            const depInstaller = Beautify.spinner(Color.brightBlue("Installing dependencies...")).start();

            const command = this.getInstallCommand(ops.language);
            if (!command) return depInstaller.warn(Color.brightYellow("Looks like the generator could not" +Color.magenta("Install")+"The dependencies. Please install them manually!"));

            cp.exec(this.path === "." ? command : `cd ${this.path} && ${command}`, (error) => {
                if (error) return depInstaller.warn(Color.brightYellow("Generated project but couldn't install dependencies, please try again manually!"));
                depInstaller.succeed(Color.greenBright("Successfully Installed dependencies!"));

                return this.initGit();
            });
        });
    }

    getInstallCommand(language = "js") {
        let cmd = "";
        switch(language) {
            case "node":
            case "js":
                cmd = "npm i";
                break;
            default:
                cmd = null;
        }

        return cmd;

    }

}

module.exports = Actions;
