import { isVNode, isVText, isWidget } from '../virtual-dom/vnode/typeof-vnode'
import { isUndef } from '../utils'

export function getSlotVnode (name, component) {
  const slot = component.$slot

  if (isUndef(name)) {
    return slot
  }

  if (slot && Array.isArray(slot) && slot.length) {
    for (let i = 0, len = slot.length; i < len; i++) {
      const vnode = slot[i]

      if (isVnode(vnode)) {
        if (name === vnode.slot) {
          return vnode
        }
      }
    }
  }

  return null
}

export function pushSlotVnode (vnodeChildren, vnode) {
  if (Array.isArray(vnode)) {
    vnodeChildren.splice(vnodeChildren.length, 0, ...vnode)
  } else {
    vnodeChildren.push(vnode)
  }
}

function isVnode (v) {
  return isVNode(v) || isVText(v) || isWidget(v)
}