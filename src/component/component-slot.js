import { isUndef, isVNode } from '../utils'

export function getSlotVNode (name, component) {
  const slot = component.$slot

  if (isUndef(name)) {
    return slot
  }

  if (slot && Array.isArray(slot) && slot.length) {
    for (let i = 0, len = slot.length; i < len; i++) {
      const vnode = slot[i]

      if (isVNode(vnode)) {
        if (name === vnode.slot) {
          return vnode
        }
      }
    }
  }

  return null
}

export function pushSlotVNode (vnodeChildren, vnode) {
  if (Array.isArray(vnode)) {
    vnodeChildren.push.apply(vnodeChildren, vnode)
  } else {
    vnodeChildren.push(vnode)
  }
}