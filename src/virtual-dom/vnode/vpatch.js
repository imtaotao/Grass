import version from './version'

VirtualPatch.NONE = 0 // 没有变化
VirtualPatch.VTEXT = 1 // vtext 的变化
VirtualPatch.VNODE = 2 // 整个 vnode 的变化
VirtualPatch.WIDGET = 3 // 自定义组件的变化
VirtualPatch.PROPS = 4 // 属性的变化
VirtualPatch.ORDER = 5 // 排序的变化（顺序改变了）
VirtualPatch.INSERT = 6 // 插入
VirtualPatch.REMOVE = 7 // 删除
VirtualPatch.THUNK = 8 // thunk 函数的变化

export default function VirtualPatch(type, vNode, patch) {
    // type 就是上面的一些标致数字，记录着我们进行 diff 时，vnode 是何种变化
    // 以便我们再 patch 的时候进行 dom 的更新
    this.type = Number(type)
    // vnode 为旧的 vnode
    this.vNode = vNode
    // patch 为变化的，后续要更新的 vnode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"
