import { isNumber, isObject, isPlainObject, isPrimitive } from './type_check'
import { TAG, TEXT, STATICTAG } from '../ast/parse_template'

export function cached (fn) {
  const cache = Object.create(null)
  return function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

export function makeMap (str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

export const isBuiltInTag = makeMap('slot,component', true)

export const isInserComponents = makeMap('component,transition,transition-group,keep-alive,slot')

// 深拷贝 node
export function copyNode (node, parent = null) {
  const newNode = new node.constructor

  if (isNumber(node.type)) {
    newNode.parent = parent
    newNode.isCopyNode = true
    newNode.getOriginNode = () => node
  }

  for (const key of Object.keys(node)) {
    const val = node[key]
    // parent 我们不深拷贝，因为会导致无穷的递归
    // 函数我们也不深拷贝，这是在我们可控范围内
    if (
        (isObject(val) ||
        Array.isArray(val)) &&
        key !== 'parent'
    ) {
      newNode[key] = copyNode(val, newNode)
      continue
    }
    newNode[key] = val
  }
  return newNode
}


// 只允许对象、数组或者类数组进行深拷贝
// 我们只对循环引用的对象进行一层的检查，应该避免使用深层循环引用的对象
// 更好的工具函数可以用 lodash
export function deepClone (obj, similarArr) {
  let res
  if (isPlainObject(obj)) {
    res = new obj.constructor
    const keys = Object.keys(obj)

    for (let i = 0; i < keys.length; i++) {
      let val = obj[keys[i]]
      // 避免循环引用
      if (val === obj) continue
      res[keys[i]] = canUse(val) ? val : deepClone(val, similarArr)
    }
    return res
  }

  if (Array.isArray(obj) || similarArr) {
    res = new obj.constructor

    for (let i = 0; i < obj.length; i++) {
      let val = obj[i]
      if (val === obj) continue
      res[i] = canUse(val) ? val : deepClone(val, similarArr)
    }
    return res
  }

  function canUse (val) {
    return (
      isPrimitive(val) ||
      val == null ||
      typeof val === 'function'
    )
  }

  // 其他的类型原样返回
  return obj
}

export function vnodeConf (astNode, parent) {
  if (astNode.type === TAG) {
    const { tagName, attrs, children, direction } = astNode
    const _attrs = deepClone(attrs)
    const _direction = deepClone(direction)
    const _children = new children.constructor(children.length)

    return vTag(tagName, _attrs, _direction, _children, parent)
  }

  return vText(astNode.content, parent)
}

export function vTag (tagName, attrs, direction, children, parent) {
  const node = Object.create(null)

  node.type = TAG
  node.attrs = attrs
  node.parent = parent
  node.tagName = tagName
  node.children = children
  node.direction = direction

  return node
}

export function vText (content, parent) {
  const node = Object.create(null)

  node.type = TEXT
  node.parent = parent
  node.content = content

  return node
}

export function removeChild (parent, child, notOnly) {
  const children = parent.children || parent
  for (let i = 0; i < children.length; i++) {
    if (children[i] === child) {
      children.splice(i, 1)
      if (notOnly) i--
      else break
    }
  }
}