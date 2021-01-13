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
import { Client } from "../index";
import { Event } from "../types/event";
import * as fs from "fs";
import { NukeLogger } from "../utils/NukeLogger";
import { Loader } from "./Loader"
import * as chalk from "chalk";

interface EventLoaderOptions {
  directory: string,
  extensions?: Array<string>
}
export class EventLoader extends Loader {
  Logger: NukeLogger = new NukeLogger();
  constructor(client, options: EventLoaderOptions = { directory: "./events" }) {
    super(client, options);

    this.init();
  }

  init() {
    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))
    console.log(chalk.gray(`#                           Events                               #`))
    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))
    this.fetchAll();
    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n`))
  }

  register(file: string, path: string) {
    const event: Event = new (require(path))(file);
    this.client.on(event.name, event.run);
    this.Logger.LOADED_EVENT(path.substring(process.cwd().length + 1));
  }

  remove(event: string) {
    if (this.events.has(event)) {
      this.events.delete(event);
      this.Logger
    } else {
      throw new Error("event " + event + " was never registered!")
    }
  }
}