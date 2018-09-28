import * as _ from '../utils'
import { h } from '../virtual-dom'
import { elementCreated } from '../global-api/constom-directive'

export function createElement (vnodeConf, children) {
  const { tagName, attrs, customDirection } = vnodeConf

  const vnode = h(tagName, attrs, children, (dom, vnode) => {
    elementCreated(dom, customDirection, vnode)
  })

  vnode.data = Object.create(null)
  
  if (vnodeConf.vTransitionType) {
    const { vTransitionType, vTransitionData } = vnodeConf

    vnode.data.vTransitionType = vTransitionType
    vnode.data.vTransitionData = vTransitionData
  }

  // 给 vnode 添加 show 的标志，在 vnode patch 的时候没有当前的 vnode，这里只添加标识
  if (!_.isUndef(vnodeConf.isShow)) {
    vnode.data.haveShowTag = true
  }

  return vnode
}