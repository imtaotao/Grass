import VNode from './vnode/vnode'
import VText from './vnode/vtext'
import { isVNode, isVText, isWidget } from './vnode/typeof-vnode'

export default function h (tagName, properties, children, elementCreated) {
  const childNodes = []
  let tag, props, key, namespace

  if (!children && isChildren(properties)) {
    children = properties
    props = {}
  }

  props = props || properties || {}
  tag = parseTag(tagName, props)

  if (props.hasOwnProperty('key')) {
    key = props.key
    props.key = undefined
  }

  if (props.hasOwnProperty('namespace')) {
    namespace = props.namespace
    props.namespace = undefined
  }

  // input value 的隐式转换处理
  if (
      tag === 'INPUT' &&
      !namespace &&
      props.hasOwnProperty('value') &&
      props.value !== undefined
  ) {
    if (props.value !== null && typeof props.value !== 'string') {
      throw new Error('virtual-dom: "INPUT" value must be a "string" or "null"')
    }
  }

  if (!isUndef(children)) {
    addChild(children, childNodes)
  }

  const vNode = new VNode(tag, props, childNodes, key, namespace)

  if (typeof elementCreated === 'function') {
    vNode.elementCreated = elementCreated
  }

  return vNode
}

function addChild (c, childNodes) {
  if (typeof c === 'string') {
    childNodes.push(new VText(c))
  } else if (typeof c === 'number') {
    childNodes.push(new VText(String(c)))
  } else if (isChild(c)) {
    childNodes.push(c)
  } else if (Array.isArray(c)) {
    for (let i = 0, len = c.length; i < len; i++) {
      addChild(c[i], childNodes)
    }
  } else if (isUndef(c)) {
    return
  } else {
    throw new Error('Unexpected value type for input passed to h()')
  }
}

function parseTag (tagName, props) {
  if (!tagName) {
    return 'DIV'
  }

  return props.namespace ? tagName : tagName.toUpperCase()
}

function isChild(x) {
  return isVNode(x) || isVText(x) || isWidget(x)
}

function isChildren(x) {
  return typeof x === 'string' || Array.isArray(x) || isChild(x)
}

function isUndef (v) {
  return v === undefined || v === null
}