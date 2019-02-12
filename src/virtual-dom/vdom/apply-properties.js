import * as _ from '../../utils/index'
import { enter, leave, applyPendingNode } from './transition'

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
      } else if (propName === 'styleName' && propValue) {
        // process styleName
        const styleNameRes = getNormalStyleNameRes(vnode, propValue)
        const result = mergeClassName(props.className, styleNameRes)
        if (result !== node.className) {
          node.className = result
        }
        // aviod repeat set className
        delete props.className
      } else if (propName === 'className') {
        // diff className
        const preValue = previous && previous.className
        if (propValue !== preValue) {
          node[propName] = propValue
        }
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

function getNormalStyleNameRes (vnode, propValue) {
  const styles = vnode.data && vnode.data.styles
  if (styles) {
    const tagName = vnode.tagName
    const compName = vnode.data && vnode.data.compName
    return processStyleName(propValue, styles, tagName, compName)
  }
  return null
}

function processStyleName (styleString, style, tagName, compName) {
  if (typeof styleString === 'string') {
    const styleNames = styleString.split(' ')
    let result = ''

    for (let i = 0, len = styleNames.length; i < len; i++) {
      const styleName = styleNames[i]

      if (styleName && _.hasOwn(style, styleName)) {
        const value = style[styleName]

        result += !result ? value : ' ' + value
      } else if (styleName) {
        compName = compName || 'unknow'
        tagName = tagName.toLocaleLowerCase()
        _.grassWarn(`"${styleName}" CSS module is undefined`, compName + `: <${tagName}/>`)
      }
    }
    return result
  }
  return null
}

function mergeClassName (className, classResult) {
  if (!className) return classResult
  return className + ' ' + classResult
}

function isObject(x) {
	return typeof x === 'object' && x !== null
}

function isAllow (x) {
  return x !== 'slot'
}