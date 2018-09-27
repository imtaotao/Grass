import * as _ from '../utils/index'
import { h } from '../virtual-dom/index'
import { elementCreated } from '../global-api/constom-directive'

export function _h (vnodeConf, children) {
  const { tagName, attrs, customDirection } = vnodeConf

  const vnode = h(tagName, attrs, children, (dom, vnode) => {
    elementCreated(dom, customDirection, vnode)
  })
  
  if (vnodeConf.vTransitionType) {
    const { vTransitionType, vTransitionData } = vnodeConf

    vnode.vTransitionType = vTransitionType
    vnode.vTransitionData = vTransitionData
  }

  // 给 vnode 添加 show 的标志，在 vnode patch 的时候没有当前的 vnode，这里只添加标识
  if (!_.isUndef(vnodeConf.isShow)) {
    vnode.haveShowTag = true
  }

  return vnode
}