const {Color} = require('callista');
const { version } = require("./package.json");
const Actions = require("./source/actions");
const askio = require('askio');
const path = require("path");
const symbols = require("log-symbols");

const help = `
    ${Color.brightCyan("The NukeJs Cli")}
    ${Color.brightWhite("--discord")}       : Shows you the discord support server invite.
    ${Color.brightWhite("--help")}          : The menu your seeing now!
    ${Color.brightWhite("--version")}       : Shows you the current version of NukeJs
    ${Color.brightWhite("--make")}        : Generate a project!
    Examples:
        ${Color.gray("$")} ${Color.brightBlue("nuke --gen")}
        ${Color.gray("$")} ${Color.brightBlue("nuke --gen ---dir=DirectoryName")}
`;

module.exports = async (args) => {
    if (args.help) {
        console.log(help);
    } else if (args.version) {
        console.log(Color.brightWhite(`v${version}`));
    } else if (args.discord) {
        console.log(`${Color.brightWhite("Join the NukeJS discord server!")}:    ${Color.brightBlue("blablabla")}`);
    } else if (args.Actions || (args._[0] && args._[0] === ".")) {
        if (args.Actions && !args.dir) return console.log(symbol.error, Color.brightRed("directory was not specified!"));
        const ok = await askio.Expand({
       message: 'Are you sure you want to create a project?',
       default:'y',
       choices:[
           {
               key:'y',
      id: "Yes",
      value:"You are ready!"
           }
           ,{
               key:'n',
               id:"No",
               value:"You aren't ready!"
           }
       ]
   });
   const language = await askio.Check({
       message:"What Language do you want the project to be in?",
       choices:[
           {
               name:"JavaScript",
               value:"javascript"
           }
           ,{
               name:"TypeScript",
               value:"TypeScript",
               disabled:true
           }
       ]
   });
   const token =await askio.Secret({
       message:"Enter your bot token!",
       mask:"*"
   })
        if (!ok) return console.log(Color.brightRed("Process stopped..."));

        let directory;
        if (language === "javascript") directory = __dirname + "/template";

        // none
        else return console.log(Color.brightRed("[Error] Couldn't locate template files!"));

        const nuke = new Actions(args._[0] === "." ? "" : args.dir, projectdir, !!args.force);

        const lang = () => {
            let l;

            switch (language) {
                case "javascript":
                    l = "node";
                    break;
                default:
                    l = null;
            }

            return l;
        }

        nuke.init(token, { language: lang() });
    } else {
        console.log(help);
    }
};
