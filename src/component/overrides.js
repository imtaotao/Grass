import * as _ from '../utils/index'
import { h } from '../virtual-dom/index'
import { elementCreated } from '../global-api/constom-directive'

export function _h (vnodeConf, children, id) {
  const { tagName, attrs, customDirection } = vnodeConf

  const vnode = h(tagName, attrs, children, (dom, vnode) => {
    elementCreated(dom, customDirection)
  })

  vnode.$id = id

  if (vnodeConf.vTransitionType) {
    const { vTransitionType, vTransitionData } = vnodeConf

    _.setOnlyReadAttr(vnode, 'vTransitionType', vTransitionType)
    _.setOnlyReadAttr(vnode, 'vTransitionData', vTransitionData)
  }

  return vnode
}