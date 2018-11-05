import runExecuteContext from './execution-env'
import * as _ from '../utils/index'

const objectFormat = /\{[^\}]*\}/
const stringFormat = /.+\s*:\s*.+\s*;?/

export default function bind (props, component, vnodeConf) {
  if (!Array.isArray(props)) {
    dealSingleBindAttr(props, component, vnodeConf)
    return
  }

  for (let i = 0, len = props.length; i < len; i++) {
    dealSingleBindAttr(props[i], component, vnodeConf)
  }
}

function dealSingleBindAttr ({attrName, value}, component, vnodeConf) {
  if (attrName === 'style') {
    if (
        !value ||
        (stringFormat.test(value) && !objectFormat.test(value))
    ) {
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
  vnodeConf.attrs[attrName] = component
    ? getValue()
    : value

  // 计算模板表达式
  function getValue () {
    return runExecuteContext(`with($obj_) { return ${value}; }`, 'bind', vnodeConf, component)
  }
}

function getNormalStyleKey (key) {
  return key.replace(/[A-Z]/g, k1 => {
    return '-' + k1.toLocaleLowerCase()
  })
}

function getFormatStyle (v) {
  const keys = Object.keys(v)
  let result = ''
  
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]
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