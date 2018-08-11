import runExecuteContext from './execution_env'

const styleString = /\{[^\}]*\}/

export default function bind (props, comp, vnodeConf) {
  if (!Array.isArray(props)) {
    dealSingleBindAttr(props, comp, vnodeConf)
    return
  }

  for (const prop of props) {
    dealSingleBindAttr(prop, comp, vnodeConf)
  }
}

function dealSingleBindAttr ({attrName, value}, comp, vnodeConf) {
  if (attrName === 'style') {
    if (!styleString.test(value)) {
      vnodeConf.attrs.style = spliceStyleStr(vnodeConf.attrs[attrName], value)
      return
    }

    vnodeConf.attrs.style = spliceStyleStr(
      vnodeConf.attrs[attrName],
      getFormatStyle(getValue())
    )
    return
  }

  // 其他所有的属性都直接添加到 vnodeConf 的 attrs 中
  vnodeConf.attrs[attrName] = getValue()

  // 计算模板表达式
  function getValue () {
    return runExecuteContext(`with($obj_) { return ${value}; }`, comp)
  }
}

function getNormalStyleKey (key) {
  return key.replace(/[A-Z]/g, k1 => {
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

function spliceStyleStr (o, n) {
  if (!o) return n
  if (o[o.length - 1] === ';')
    return o + n

  return o + ';' + n
}