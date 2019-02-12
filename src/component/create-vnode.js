import * as _ from '../utils'
import { h } from '../virtual-dom'
import { elementCreated } from '../global-api/custom-directive'

export function createVNode (vnodeConfig, children, component) {
  const compName = component.name
  const styles = component.constructor.$styles
  const { tagName, attrs, customDirection } = vnodeConfig

  const vnode = h(tagName, attrs, children, (dom, vnode) => {
    elementCreated(dom, customDirection, vnode)
  })

  vnode.data = Object.create(null)
  vnode.data.styles = styles
  vnode.data.compName = compName

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