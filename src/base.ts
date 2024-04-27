

/*
 统一的辅助工具类
*/


export class Helper {
    constructor() {
    }

    events = {}

    $on(event, callback) {
        this.events[event] ||= new Set()
        this.events[event].add(callback)
        return () => this.events[event].delete(callback)
    }

    $dispatch(event, ...params) {
        this.events[event]?.forEach(callback => callback.call(this, ...params))
    }
}