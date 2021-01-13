import { Command } from "./Command";

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
interface InhibitorOptions {
  name: string,
  enabled?: boolean
}
export class Inhibitor {
  public name: string;
  public enabled: boolean;
  constructor(options: InhibitorOptions) {
    if(!options.name) throw new Error("You need to declare a name for your Inhibitor!")
    this.enabled = options.enabled || true

    this.name = options.name;
  }

  async run(message: string, command: Command, loaderName: string): Promise<any> {}
}
