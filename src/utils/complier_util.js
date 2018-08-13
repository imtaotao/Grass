import bind from '../directives/bind'
import { warn, hasOwn } from './tool'
import { TAG, TEXT } from '../ast/parse_template'
import { isNumber, isObject, isPlainObject, isPrimitive } from './type_check'

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

export function sendDirectWarn (direct, compName) {
  warn(`Cannot make "${direct}" directives on the root node of a component，
  Maybe you can specify the "${direct}" command on "<${compName} ${direct}="xxx" />"
    \n\n  ---> ${compName}\n`)
}

// export const isBuiltInTag = makeMap('slot,component', true)

// export const isInserComponents = makeMap('component,transition,transition-group,keep-alive,slot')

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
    if ((isObject(val) || Array.isArray(val)) && key !== 'parent') {
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

  return obj
}

export function vnodeConf (astNode, parent) {
  if (astNode.type === TAG) {
    const { tagName, attrs, direction } = astNode
    const _attrs = deepClone(attrs)
    const _direction = deepClone(direction)
    const _children = []

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
  const children = parent.children
  for (let i = 0; i < children.length; i++) {
    if (children[i] === child) {
      children.splice(i, 1)
      if (notOnly) i--
      else break
    }
  }
}

const filterAttr = {
  'namespace': 1,
  'className': 1,
  'styleName': 1,
  'style': 1,
  'class': 1,
  'key': 1,
  'id': 1,
}

function isFilter (key) {
  return filterAttr[key] || key.slice(0, 2) === 'on'
}

export function modifyOrdinayAttrAsLibAttr (node) {
  if (!node.attrs) return
  const keyWord = 'attributes'
  const attrs = node.attrs
  const originAttr = attrs[keyWord]
  const keys = Object.keys(attrs)

  attrs[keyWord] = Object.create(null)

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]
    if (isFilter(key)) continue
    attrs[keyWord][key] = attrs[key]
  }

  if (originAttr)
    attrs[keyWord][keyWord] = originAttr
}

export function migrateCompStatus (outputNode, acceptNode) {
  if (!outputNode || !acceptNode) return
  // 我们需要迁移的数据 vTextResult、vShowResult
  if (hasOwn(outputNode, 'vTextResult')) {
    const res = outputNode['vTextResult']
    acceptNode.children.unshift(vText(res, acceptNode))
  }

  if (hasOwn(outputNode, 'vShowResult')) {
    const res = outputNode['vShowResult']
    bind(res, null, acceptNode)
  }
}

const filterPropsList = {
  'key': 1,
}

export function setProps (attrs, requireList, compName) {
  // 如果定义了需要的 props 列表，我们就按照列表得到来
  // 而且我们需要过滤掉内部用到的属性，例如 "key"
  const props = Object.create(null)
  const keys = Object.keys(attrs)
  let index = null

  for (let i = 0; i < keys.length; i++) {
    if (filterPropsList[keys[i]]) continue
    const key = keys[i]
    const val = attrs[key]

    if (!requireList) {
      props[key] = val
    } else if (requireList && ~(index = requireList.indexOf(key))) {
      props[key] = val
      requireList.splice(index, 1)
    }
  }

  if (requireList && requireList.length) {
    for (let j = 0; j < requireList.length; j++) {
      warn(
        `Parent component does not pass "${requireList[j]}" attribute  \n\n    --->  ${compName}\n`,
        true,
      )
    }
  }

  return props
}