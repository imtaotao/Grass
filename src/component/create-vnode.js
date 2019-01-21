import * as _ from '../utils'
import { h } from '../virtual-dom'
import { genChildren } from './render'
import { WidgetVNode, transferData } from './component-vnode'
import { createAsyncComponent } from './component-async'
import { elementCreated } from '../global-api/custom-directive'

export function createVNode (vnodeConfig, children) {
  const { tagName, attrs, customDirection } = vnodeConfig

  const vnode = h(tagName, attrs, children, (dom, vnode) => {
    elementCreated(dom, customDirection, vnode)
  })

  vnode.data = Object.create(null)

  if (vnodeConfig.vTransitionType) {
    const { vTransitionType, vTransitionData } = vnodeConfig

    vnode.data.vTransitionType = vTransitionType
    vnode.data.vTransitionData = vTransitionData
  }

  // Add 'show' flag in vnode, when vnode patch, it's no vnode for currently, so, is only add flag
  if (!_.isUndef(vnodeConfig.isShow)) {
    vnode.data.haveShowTag = true
  }

  // We need record name of slot tag
  if (attrs.slot) {
    vnode.slot = attrs.slot
  }

  return vnode
}

export function createComponentVNode (child, childClass, component) {
  // If a async component
  if (childClass.async) {
    const { factory, cb } = childClass
    childClass = createAsyncComponent(factory, component, cb)
    // If no childClass, represent no loading component or other component.
    if (!childClass) { 
      // We don't need placeholder vnode, not render just fine.
      return null
    }
  }
  
  const slotVNode = genChildren(child.children, component)
  
  // If a share component
  if (childClass.share) {
    const { fn, component } = childClass
    const oldVNode = component.$widgetVNode
    const newVNode = new WidgetVNode(component, child, slotVNode, fn, true)

    transferData(newVNode, oldVNode)

    return newVNode
  }

  const vnode = new WidgetVNode(component, child, slotVNode, childClass)
  return vnode
}