/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
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

import * as chalk from 'chalk';
import { Client } from '../index';
import Inhibitor from '../types/Inhibitor';
import Loader from './Loader';
import NukeLogger from '../utils/NukeLogger';

interface InhibitorLoaderOptions {
  directory: string,
  extensions: Array<string>
}

export default class extends Loader {
  client: Client;

  Logger: NukeLogger = new NukeLogger();

  constructor(client, options: InhibitorLoaderOptions) {
    super(client, options);

    this.init();
  }

  init() {
    console.log(chalk.gray('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'));
    console.log(chalk.gray('#                          Inhibitor                             #'));
    console.log(chalk.gray('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'));
    this.fetchAll();
    console.log(chalk.gray('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n'));
  }

  // eslint-disable-next-line no-unused-vars
  register(file: string, path: string, category?: string) {
    try {
      const inhibitor: Inhibitor = new (require(path))(file);
      this.client.InhibitorStore.set(inhibitor.name, inhibitor);
      this.Logger.LOADED_INHIBITOR(path.substring(process.cwd().length + 1));
    } catch (error) {
      console.error(error);
    }
  }
}
