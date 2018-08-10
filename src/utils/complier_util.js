import { isNumber, isObject } from './type_check'

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