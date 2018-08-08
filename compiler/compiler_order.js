import * as W from './directives'
import { compilerComponent } from './compiler_component'
import { isObject, copyNode, warn } from '../utils'
import {
  TAG,
  TEXT,
  STATICTAG,
  _createStaticNode,
} from './parse-html'

// 指令数量
const orderLength = 5

export function complierTemplate (nodes, componentConf) {
  !componentConf.state && (componentConf.state = {})
  if (!isObject(componentConf.state)) {
    return warn('Component "state" must be a "Object"')
  }

  for (const node of nodes) {
    dealSingleNode(node, componentConf)
  }

  return nodes
}

function dealSingleNode (node, componentConf) {
  if (!node.isHTMLTag && !node.isSvgTag) {
    return
  }
  
  if (node.type === TAG) {
    if (node.tagName === 'template') {
      isLegalComponent(node)
      node.tagName = 'div'
      complierTemplate(node.children, componentConf)
      return
    }

    // 处理有指令的情况，我们会在每个指令的执行过程中进行递归调用，编译其 children
    if (node.hasBindings()) {
      const sortOrder = []
      let currentWeight = null

      for (const order of node.direction) {
        // 拿到各个指令的权重
        const key = Object.keys(order)[0]
        const weight = W.priority(key)
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

        // 我们需要判断 v-if，如果是 false 我们根本就没有必要继续下去
        if (delOrder(i, key, val, node, componentConf) === false && i === W.IF) {
          node.type = TEXT
          node.content = ''
          node.tagName = null
          node.children = []
          return
        }
      }
    }
  }

  if (node.type === STATICTAG) {
    node.content = createFunction(`
      with (_obj_) {
        function _s (_val_) { return _val_ };
        return ${node.expression};
      }
    `).call(componentConf, componentConf.state)
  }

  // v-for 已经在指令中对子 node 进行过处理了，因为在循环的过程中要保证当前值的一致性
  if (!node.for && node.children) {
    complierTemplate(node.children, componentConf)
  }
}

function delOrder (weight, key, val, node, componentConf) {
  switch (weight) {
    case W.SHOW :
      show(node, val, componentConf)
      break
    case W.FOR :
      vFor(node, val, componentConf)
      break
    case W.ON :
      onEvent(node, key, val, componentConf)
      break
    case W.TEXT :
      text(node, val, componentConf)
      break
    case W.BIND :
      bind(node, key, val, componentConf)
      break
    case W.IF :
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
        return warn('Template component can only have one child element')
      }
    }
  }
}

function createFunction (funStr) {
  return new Function('_obj_', '_hookFunction_', funStr)
}

function show (node, val, componentConf) {
  const fun = createFunction(`
    with(_obj_) {
      return !!(${val});
    }
  `)

  if (!fun.call(componentConf, componentConf.state)) {
    bind(node, 'style', '{ style: "display: none" }', componentConf)
  }
}

function vFor (node, val, componentConf) {
  if (node.for && !node.forArgs) return
  let index = 0
  const children = node.children.splice(0)

  const fun = createFunction(`
    var _isMultiple_ = ${node.forArgs.isMultiple};

    with(_obj_) {
      var _container_ = ${node.forArgs.data};

      for (var _i_ = 0; _i_ < _container_.length; _i_++) {
        if (_isMultiple_) {
          _obj_['${node.forArgs.key[0]}'] = _container_[_i_];
          _obj_['${node.forArgs.key[1]}'] = _i_;
        } else {
          _obj_['${node.forArgs.key}'] = _container_[_i_];
        }

        _hookFunction_(_i_, _container_.length);
      }
    }
  `)

  function createForChild (i, length) {
    for (let j = 0; j < children.length; j++) {
      const newChild = copyNode(children[j])
      node.children[index] = newChild

      if (newChild.type === TAG) {
        newChild.attrs.key = index
      }
      dealSingleNode(newChild, componentConf)
      index++
    }
  }

  fun.call(componentConf, componentConf.state, createForChild)
}

function onEvent (node, key, val, componentConf) {
  if (node.isHTMLTag) {
    const eventName = key.split(':')[1].trim()
    const eventFun = createFunction(`
      with (_obj_) {
        return ${val};
      }
    `).call(componentConf, componentConf.state)

    node.attrs.event
      ? node.attrs.event[eventName] = eventFun
      : node.attrs.event = { [eventName]: eventFun }
  }
}

function text (node, val, componentConf) {
  const content = createFunction(`
    with(_obj_) {
      return ${val};
    }
  `).call(componentConf, componentConf.state)

  node.children.unshift(_createStaticNode(content, node))
}

function vIf (node, val, componentConf) {
  const fun = createFunction(`
    with(_obj_) {
      return !!(${val});
    }
  `)

  return fun.call(componentConf, componentConf.state)
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
        styleStr += `${style[key]}; `
      }

      return styleStr
    }

    const style = createFunction(`
      with(_obj_) {
        return ${val};
      }
    `).call(componentConf, componentConf.state)

    node.attrs.style = formatStyle(style)
    return
  }

  node.attrs[attrName] = val
}