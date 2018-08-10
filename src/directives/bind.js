import runExecutContext from './execution_env'

const styleString = /\{[^\}]*\}/

export default function bind (node, props, comp) {
  if (!Array.isArray(props)) {
    dealSingleBindVal(node, props, comp)
    return
  }

  for (const prop of props) {
    dealSingleBindVal(node, prop, comp)
  }
}

function dealSingleBindVal (node, {attrName, value}, comp) {
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
    return runExecutContext(`with($obj_) { return ${value}; }`, comp)
  }
}

function getNormalStyleKey (key) {
  return key.replace(/[A-Z]/g, (k1) => {
    return '-' + k1.toLocaleLowerCase()
  })
}

function getFormatStyle (v) {
  let result = ''
  for (const key of Object.keys(v)) {
    result += `${getNormalStyleKey(key)}: ${v[key]};`
  }

  return result
}

function spliceStyle (o, n) {
  if (!o) return n
  if (o[o.length - 1] === ';')
    return o + n

  return o + ';' + n
}