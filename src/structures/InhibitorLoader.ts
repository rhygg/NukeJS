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
import { Inhibitor } from "../types/Inhibitor";
import { Loader } from "./Loader";
import * as chalk from "chalk";
import { NukeLogger } from "../utils/NukeLogger";


interface InhibitorLoaderOptions {
  directory: string,
  extensions: Array<string>
}

export class InhibitorLoader extends Loader {
  client: Client;
  Logger: NukeLogger = new NukeLogger();
  constructor(client, options: InhibitorLoaderOptions) {
    super(client, options)

    this.init();
  }

  init() {
    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))
    console.log(chalk.gray(`#                          Inhibitor                             #`))
    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`))
    this.fetchAll();
    console.log(chalk.gray(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n`))
  }

  register(file: string, path: string, category?: string) {
    try {
      const inhibitor: Inhibitor = new (require(path))(file);
      this.client.InhibitorStore.set(inhibitor.name, inhibitor);
      this.Logger.LOADED_INHIBITOR(path.substring(process.cwd().length + 1));
    } catch(error) {
      console.error(error);
    }
  }
}