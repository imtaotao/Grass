import document from 'global/document'
import applyProperties from 'virtual-dom/vdom/apply-properties'
import isVNode from 'virtual-dom/vnode/is-vnode'
import isVText from 'virtual-dom/vnode/is-vtext'
import isWidget from 'virtual-dom/vnode/is-widget'
import handleThunk from 'virtual-dom/vnode/handle-thunk'
import { warn } from '../utils'

export default function createElement (vnode, opts) {
  const doc = opts ? opts.document || document : document

  vnode = handleThunk(vnode).a

  if (isWidget(vnode)) {
      return vnode.init()
  } else if (isVText(vnode)) {
      return doc.createTextNode(vnode.text)
  } else if (!isVNode(vnode)) {
    warn('Item is not a valid virtual dom node')
    return null
  }

  const node = (vnode.namespace === null) ?
    doc.createElement(vnode.tagName) :
    doc.createElementNS(vnode.namespace, vnode.tagName)

  const props = vnode.properties
  applyProperties(node, props)

  const children = vnode.children

  for (let i = 0; i < children.length; i++) {
    const childNode = createElement(children[i], opts)
    if (childNode) {
      node.appendChild(childNode)
    }
  }

  if (vnode.renderCompleted) {
    vnode.renderCompleted(node)
  }
  
  return node
}