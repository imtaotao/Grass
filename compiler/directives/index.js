import * as W from './weight'
import { isObject, copyNode, warn } from '../utils'
import {
  TAG,
  TEXT,
  STATICTAG,
  _createStaticNode,
} from '../ast/parse_html'

// 指令数量
const orderLength = 5
const styleString = /\{[^\}]*\}/

export function complierTemplate (nodes, componentConf, compName) {
  !componentConf.state && (componentConf.state = {})
  if (!isObject(componentConf.state)) {
    return warn(`Component "state" must be a "Object"  \n\n  ---> ${[componentName]}\n`)
  }

  for (const node of nodes) {
    dealSingleNode(node, componentConf, compName)
  }

  return nodes
}

function dealSingleNode (node, componentConf, compName) {
  if (node.type === TAG && !node.isHTMLTag && !node.isSvgTag) {
    return
  }

  if (node.type === TAG) {
    if (node.tagName === 'template') {
      isLegalComponent(node, compName)
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

        // 清除重复的指令，但是需要排除事件和bind
        if (
            weight !== W.BIND &&
            weight !== W.ON &&
            weight === currentWeight
        ) continue

        // 对于 bind 和 on 我们保存为一个数组中
        currentWeight = weight

        if (weight === W.BIND || weight === W.ON) {
          const detail = {
            attrName: key.split(':')[1].trim(),
            value: order[key]
          }

          !sortOrder[weight]
            ? sortOrder[weight] = [detail]
            : sortOrder[weight].push(detail)
        } else {
          sortOrder[weight] = order[key]
          sortOrder[weight + 'key'] = key
        }
      }

      // 我们现在定义了五种指令
      for (let i = orderLength; i > -1; i--) {
        const val = sortOrder[i]
        const key = sortOrder[i + 'key']

        // 如果一个指令没有赋值，我们过滤掉
        if (!val) continue

        // 我们需要判断 v-if，如果是 false 我们根本就没有必要继续下去
        if (dealOrder(i, key, val, node, componentConf) === false && i === W.IF) {
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

function dealOrder (weight, key, val, node, componentConf) {
  switch (weight) {
    case W.SHOW :
      show(node, val, componentConf)
      break
    case W.FOR :
      vFor(node, val, componentConf)
      break
    case W.ON :
      onEvent(node, val, componentConf)
      break
    case W.TEXT :
      text(node, val, componentConf)
      break
    case W.BIND :
      bind(node, val, componentConf)
      break
    case W.IF :
      return vIf(node, val, componentConf)
  }
}

function isLegalComponent (node, compName) {
  let componentNumber = 0

  for (const child of node.children) {
    if (
        child.type === 2 ||
        child.expression ||
        child.content && child.content.trim()
    ) {
      componentNumber++

      if (componentNumber > 1) {
        return warn(`Template component can only have one child element  \n\n  --->  [${compName}]\n`)
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

  const value = fun.call(componentConf, componentConf.state)
    ? ''
    : 'display: none'

  bind(node, {
    attrName: 'style',
    value: value,
  }, componentConf)
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

function onEvent (node, events, componentConf) {
  if (node.isHTMLTag) {
    for (const event of events) {
      const eventName = event.attrName
      const eventFun = createFunction(`
        with (_obj_) {
          return ${event.value};
        }
      `).call(componentConf, componentConf.state)

      node.attrs['on' + eventName] = eventFun
    }
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

function bind (node, props, componentConf) {
  if (!Array.isArray(props)) {
    dealSingleBindVal(node, props, componentConf)
    return
  }

  for (const prop of props) {
    dealSingleBindVal(node, prop, componentConf)
  }
}

function dealSingleBindVal (node, { attrName, value }, componentConf) {
  if (attrName === 'style') {
    if (!styleString.test(value)) {
      node.attrs[attrName] = spliceStyle(node.attrs[attrName], value)
      return
    }

    node.attrs.style = spliceStyle(
      node.attrs[attrName],
      getFormatStyle(getValue())
    )
    return
  }

  // 其他所有的属性都直接添加到 node 的 attrs 中
  node.attrs[attrName] = getValue()


  // 计算模板表达式
  function getValue () {
    return createFunction(`
      with(_obj_) {
        return ${value};
      }
    `).call(componentConf, componentConf.state)
  }

  // 转换 css 属性名驼峰
  function getNormalStyleKey (key) {
    return key.replace(/[A-Z]/g, (k1) => {
      return '-' + k1.toLocaleLowerCase()
    })
  }

  // 把 style 的对象格式化为浏览器可以解析的格式
  function getFormatStyle (v) {
    let result = ''
    for (const key of Object.keys(v)) {
      result += `${getNormalStyleKey(key)}: ${v[key]};`
    }

    return result
  }

  // 拼接新旧两个 style
  function spliceStyle (o, n) {
    if (!o) return n
    if (o[o.length - 1] === ';')
      return o + n

    return o + ';' + n
  }
}