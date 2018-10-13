import * as _ from '../../utils/index'
import { enter, leave, addClass, applyPendingNode } from './transition'

export default function applyProperties(node, vnode, props, previous) {
  for (let propName in props) {
    const propValue = props[propName]
    
    if (propValue === undefined) {
      removeProperty(node, propName, propValue, previous)
    } else if (isObject(propValue)) {
      patchObject(node, propName, propValue, previous)
    } else {
      if (propName === 'style' && vnode.data.haveShowTag) {
        transition(node, vnode, propValue, () => {
          node[propName] = propValue
        })
      } else if (propName === 'className') {
        addClass(node, propValue)
      } else if (isAllow(propName)) {
        node[propName] = propValue
      }
    }
  }
}

function removeProperty (node, propName, previous) {
  if (!previous) {
    return
  }

  const previousValue = previous[propName]

  if (propName === 'attributes') {
    for (let attrName in previousValue) {
      node.removeAttribute(attrName)
    }
  } else if (propName === 'style') {
    for (let styleName in previousValue) {
      node.style[styleName] = ''
    }
  } else if (typeof previousValue === 'string') {
    node[propName] = ''
  } else {
    node[propName] = null
  }
}

function patchObject (node, propName, propValue, previous) {
  const previousValue = previous
    ? previous[propName]
    : undefined

  if (propName === 'attributes') {
    for (let attrName in propValue) {
      const attrValue = propValue[attrName]

      attrValue === undefined
        ? node.removeAttribute(attrName)
        : node.setAttribute(attrName, attrValue)
    }
    return
  }

  if (previousValue && isObject(previousValue)) {
    if (Object.getPrototypeOf(previousValue) !== Object.getPrototypeOf(propValue)) {
      node[propName] = propValue
      return
    }
  }

  // 我们对 props 为 {} 的属性进行 apply。例如 "style"
  if (!isObject(node[propName])) {
    node[propName] = {}
  }

  const replacer = propName === 'style'
    ? ''
    : undefined

  for (let key in propValue) {
    const value = propValue[key]

    node[propName][key] = value === undefined
      ? replacer
      : value
  }
}

function transition (node, vnode, propValue, callback) {
  const isShow = !propValue
  
  if (isShow) {
    // 移除正在动画的元素
    applyPendingNode(node.parentNode)
    callback()
    enter(node, vnode, _.noop)
  } else {
    leave(node, vnode, callback)
  }
}

function isObject(x) {
	return typeof x === 'object' && x !== null
}

function isAllow (x) {
  return x !== 'slot'
}