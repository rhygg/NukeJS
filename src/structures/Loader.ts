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
import { Client } from "../index";
const EventEmitter = require('events');
import * as fs from "fs";

interface LoaderOptions {
  directory: string,
  extensions?: Array<string>
}
export class Loader extends EventEmitter {
  directory: string;
  extensions: Array<string>;
  client: Client;

  constructor(client, options: LoaderOptions) {
    super();
    if (!options.directory) throw new Error("Parameter <directory> cannot be empty in eventLoaderOptions");
    if (!(client instanceof Client)) throw new Error("Argument <client> must be a NukeJS instance");

    this.directory = process.cwd() + "/" + options.directory;
    this.client = client;

    this.extensions = options.extensions || [".js", ".ts"]
  }

  init() { }

  register(file: string, path: string, category?: string) {}

  fetchAll() {
    const files = fs.readdirSync(this.directory);
    files.forEach(file => {
      if (fs.lstatSync(this.directory + "/" + file).isDirectory()) {
        this.readDirRecursively(this.directory + "/" + file).forEach(subFile => {
          this.register(subFile.split("/")[subFile.split("/").length-1], subFile, file);
        });
      } else if (fs.lstatSync(this.directory + "/" + file).isFile()) {
        this.extensions.forEach(extension => {
          if (file.endsWith(extension)) {
            this.register(file,`${this.directory}/${file}`);
          }
        })
      }

    })
  }

  remove(value: string) { }

  readDirRecursively(path: string): Array<string> {
    const items = fs.readdirSync(path)
    let files = []
    items.forEach(item => {
      if (fs.lstatSync(path + "/" + item).isFile()) {
        this.extensions.forEach(extension => {
          if (item.endsWith(extension)) {
            files.push(path + "/" + item);
          }
        })
      } else if (fs.lstatSync(path + "/" + item).isDirectory()) {
        files.push(this.readDirRecursively(path + "/" + item));
      }
    })
    return files
  }
}