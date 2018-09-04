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

  addEnterTransition(node, vnode)

  return node
}

function addEnterTransition (node, vnode) {
  const transitionClassName = vnode.properties.transitionName

  if (typeof transitionClassName === 'string') {
    const enter = transitionClassName + '-enter'
    const active = transitionClassName + '-enter-active'

    node.addEventListener('webkitTransitionEnd', e => {
      console.log(121);
    })
    node.classList.add(enter, active)

    requestAnimationFrame(() => {
      getLen(node)
      node.classList.remove(enter)
    })
  }
}

function getLen (el) {
  const styles = window.getComputedStyle(el)
  const transitionDelays = styles['WebkitTransition' + 'Delay'].split(', ')
  const transitionDuration = styles['WebkitTransition' + 'Duration'].split(', ')
  console.log(styles['WebkitTransitionDuration'], styles.WebkitTransitionDuration);
  window.sss = styles
  console.log(transitionDelays, transitionDuration);
}