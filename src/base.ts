

/*
 统一的辅助工具类
*/


export enum ThreeEvnets {
    // 画布滑动触发
    SWIPE = 'swipe',
    // 元素滑动时触发 , 上下左右四个方向
    MESH_SWIPE = ',mesh-swipe',
    // 画布点击
    CLICK = 'click',
    // 元素点击
    MESH_CLICK = 'mesh-click',
}


export class Helper {
    constructor() {
    }

    private events = {}

    $on(event, callback) {
        this.events[event] ||= new Set()
        this.events[event].add(callback)
        return () => this.events[event].delete(callback)
    }

    $dispatch(event, ...params) {
        this.events[event]?.forEach(callback => callback.call(this, ...params))
    }
}