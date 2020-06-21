class Event {
    constructor(options = {}) {
        this.name = options.name || 'message'
        this.enabled = options.enabled || true
    }

    async run() {
        
    }
}
module.exports = Event