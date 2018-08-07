import { priority } from './directives'
import { isObject, isNumber } from '../utils'
import { _createStaticNode } from './parse-html'

// 指令数量
const orderLength = 5

export function complierTemplate (nodes, componentConf) {
  !componentConf.data && (componentConf.data = {})
  if (!isObject(componentConf.data)) {
    throw Error('[Grass tip]: Component data must be a "Object"')
  }
  
  for (const node of nodes) {
    dealSingleNode(node, componentConf)
  }
}

function dealSingleNode (node, componentConf) {
  if (node.type === 2) {
    if (node.type === 2 && node.tagName === 'template') {
      isLegalComponent(node)
      complierTemplate(node.children, componentConf)
      return
    }

    // 处理有指令的情况
    if (node.hasBindings()) {
      const sortOrder = []
      let currentWeight = null

      for (const order of node.direction) {
        // 拿到各个指令的权重
        const key = Object.keys(order)[0]
        const weight = priority(key)
        // 清除重复的指令
        if (weight === currentWeight) continue

        currentWeight = weight
        sortOrder[weight] = order[key]
        sortOrder[weight + 'key'] = key
      }

      // 我们现在定义了五种指令
      for (let i = orderLength; i > -1; i--) {
        const val = sortOrder[i]
        const key = sortOrder[i + 'key']

        // 如果一个指令没有赋值，我们过滤掉
        if (!val) continue

        const condition = delOrder(i, key, val, node, componentConf)
        // 我们需要判断 v-if，如果是 false 我们根本就没有必要继续下去
        if (i === 4 && condition === false) {
          return
        }
      }
    }
  }

  console.log(node)
  // 处理表达式
  if (node.type === 1 && node.expression) {
    console.log(node);
    
  }
}

function delOrder (weight, key, val, node, componentConf) {
  switch (weight) {
    case 0 :
      show(node, val, componentConf)
      break
    case 1 :
      vFor(node, val, componentConf)
      break
    case 2 :
      on(node, val, componentConf)
      break
    case 3 :
      text(node, val, componentConf)
      break
    case 4 :
      bind(node, key, val, componentConf)
      break
    case 5 :
      return vIf(node, val, componentConf)
  }
}

function isLegalComponent (node) {
  let componentNumber = 0

  for (const child of node.children) {
    if (
        child.type === 2 ||
        child.expression ||
        child.content && child.content.trim()
    ) {
      componentNumber++

      if (componentNumber > 1) {
        throw Error('[Grass tip]: Template component can only have one child element')
      }
    }
  }
}

// 深拷贝 node
function copyNode (node, parent = null) {
  const newNode = new node.constructor

  if (isNumber(node.type)) {
    newNode.parent = parent
    newNode.isCopyNode = true
  }

  for (const key of Object.keys(node)) {
    const val = node[key]

    // parent 我们不深拷贝，因为会导致无穷的递归
    // 函数我们也不深拷贝
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

function createFunction (funStr) {
  return new Function('_obj_', '_hookFunction_', funStr)
}

function show (node, val, componentConf) {
  const fun = createFunction(`
    with(_obj_) {
      return !!(${val})
    }
  `)

  if (!fun.call(componentConf, componentConf.data)) {
    bind(node, 'style', {
      style: "display: 'none'",
    }, componentConf)
  }
}

function vFor (node, val, componentConf) {
  if (!node.forArgs) return
  let index = 0
  const children = node.children.splice(0)

  const fun = createFunction(`
    var _isMultiple_ = ${node.forArgs.isMultiple}

    with(_obj_) {
      var _container_ = ${node.forArgs.data}

      for (var _i_ = 0; _i_ < _container_.length; _i_++) {
        if (_isMultiple_) {
          _obj_['${node.forArgs.key[0]}'] = _container_[_i_]
          _obj_['${node.forArgs.key[1]}'] = _i_
        } else {
          _obj_['${node.forArgs.key}'] = _container_[_i_]
        }

        _hookFunction_(_i_, _container_.length)
      }
    }
  `)

  function createForChild (i, length) {
    for (let j = 0; j < children.length; j++) {
      const newChild = copyNode(children[j])
      node.children[index] = newChild

      dealSingleNode(newChild, componentConf)
      index++
    }

    if (i + 1 === length) {
      complierTemplate(node.children, componentConf)}
  }

  fun.call(componentConf, componentConf.data, createForChild)
}

function on (node, val, componentConf) {

}

function text (node, val, componentConf) {
  const content = createFunction(`
    with(_obj_) {
      return ${val}
    }
  `).call(componentConf, componentConf.data)

  node.children.unshift(_createStaticNode(content, node))
}

function vIf (node, val, componentConf) {
  const fun = createFunction(`
    with(_obj_) {
      return !!(${val})
    }
  `)

  return fun.call(componentConf, componentConf.data)
}

function bind (node, key, val, componentConf) {
  const attrName = key.includes('v-bind')
    ? key.split(':')[1].trim()
    : key

  if (!attrName) return

  if (attrName === 'style') {
    function formatStyle (style) {
      let styleStr = ''
      for (const key of Object.keys(style)) {
        styleStr += `${key}: ${style[key]}; `
      }
  
      return styleStr
    }

    const style = createFunction(`
      with(_obj_) {
        return ${val}
      }
    `).call(componentConf, componentConf.data)
    
    node.attrs.style = formatStyle(style)
    complierTemplate(node.children, componentConf)
    return
  }

  node.attrs[attrName] = val
  complierTemplate(node.children, componentConf)
}