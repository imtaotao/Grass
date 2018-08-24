import applyProperties from './apply-properties'
import { isVNode, isVText, isWidget } from '../vnode/typeof-vnode'

export default function createElement (vnode) {
  if (isWidget(vnode)) {
    const node = vnode.init()

    if (typeof vnode.elementCreated === 'function') {
      vnode.elementCreated(node, vnode)
    }

    return node
  } else if (isVText(vnode)) {
    return document.createTextNode(vnode.text)
  } else if (!isVNode(vnode)) {
    console.error('virtual-dom: Item is not a valid virtual dom node')
    return null
  }

  const node = vnode.namespace === null
    ? document.createElement(vnode.tagName)
    : document.createElementNS(vnode.namespace, vnode.tagName)

  const { properties, children } = vnode

  applyProperties(node, properties)

  for (let i = 0, len = children.length; i < len; i++) {
    const childNode = createElement(children[i])

    if (childNode) {
      node.appendChild(childNode)
    }
  }

  if (typeof vnode.elementCreated === 'function') {
    vnode.elementCreated(node, vnode)
  }

  return node
}