interface EventOptions {
  name: string,
  enabled?: boolean
}
class Event {
  public name: string;
  public enabled: boolean;
  constructor(options: EventOptions) {
    this.name = options.name || 'message'
    this.enabled = options.enabled || true
  }

  async run() {}
}
module.exports = Event