import * as _ from '../utils/index'
import { h } from '../virtual-dom/index'
import { elementCreated } from '../global-api/constom-directive'

export function _h (tagName, attrs, customDirection, children) {
  const vnode = h(tagName, attrs, children, (dom, vnode) => {
    elementCreated(dom, vnode.customDirection)
  })

  // customDirection 设置为只读属性
  _.setOnlyReadAttr(vnode, 'customDirection', customDirection || null)
  return vnode
}