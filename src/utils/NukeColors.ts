export default {
  getGreen(msg: any): string {
    return `\x1b[32m${msg}\x1b[0m`;
  },
  getRed(msg: any): string {
    return `\x1b[31m${msg}\x1b[0m`;
  },
  getBlue(msg: any): string {
    return `\x1b[34m${msg}\x1b[0m`;
  },
  getMagenta(msg: any): string {
    return `\x1b[95m${msg}\x1b[0m`;
  },
  getGray(msg: any): string {
    return `\x1b[90m${msg}\x1b[0m`;
  },
};
