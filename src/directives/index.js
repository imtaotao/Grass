import * as W from './weight'
import * as _ from '../utils'
import bind from './bind'
import vevent from './event'
import vfor from './for'
import vif from './if'
import show from './show'
import text from './text'
import runExecuteContext from './execution-env'
import { TAG, STATICTAG } from '../ast/parse-template'

/**
 *  vnodeConf 作为一个创建 vnodeTree 的配置项
 *  避免每次 diff 创建 vnode 都需要对整个 ast 进行复制编译
 *  因为现在没有办法做到针对单个指令进行编译
 *  所以我们只能尽量降低每次编译指令时的开销
 *  ：
 *    {
 *      type: TAG | TEXT | STATICTAG
 *      parent: vnode
 *      tagName ?: string
 *      attrs ?: array
 *      children ?: array
 *      content ?: string
 *    }
 */

export default function complierAst (ast, comp) {
  const state = comp.state
  const vnodeConf = _.vnodeConf(ast)
  vnodeConf.props = Object.create(null)

  if (_.isFunction(state)) {
    const res = state()
    _.isPlainObject(res)
      ? comp.state = res
      : _.warn(`Component "state" must be a "Object"  \n\n  ---> ${comp.name}\n`)
  }

  parseSingleNode(ast, comp, vnodeConf)
  
  return vnodeConf
}

export function complierChildrenNode (node, comp, vnodeConf) {
  const children = node.children
  if (!children || !children.length) return

  for (let i = 0; i < children.length; i++) {
    const childVnodeConf = _.vnodeConf(children[i], vnodeConf)
    vnodeConf.children.push(childVnodeConf)
    parseSingleNode(children[i], comp, childVnodeConf)
  }
}

export function parseSingleNode (node, comp, vnodeConf) {
  switch (node.type) {
    case TAG :
      if (parseTagNode(node, comp, vnodeConf) === false)
        return false
      break
    case STATICTAG :
      parseStaticNode(node, comp, vnodeConf)
      break
  }

  if (!node.for) {
    complierChildrenNode(node, comp, vnodeConf)
  }
}

function parseTagNode (node, comp, vnodeConf) {
  // 处理有指令的情况，我们会在每个指令的执行过程中进行递归调用，编译其 children
  if (node.hasBindings()) {
    return complierDirect(node, comp, vnodeConf)
  }
}

function complierDirect (node, comp, vnodeConf) {
  const directs = node.direction
  const nomalDirects = []
  let currentWeight = null

  for (let i = 0; i < directs.length; i++) {
    const direct = directs[i]
    const key = Object.keys(direct)[0]
    const weight = W.getWeight(key)

    if (isSameDirect(weight)) continue

    currentWeight = weight

    if (isMultipleDirect(weight)) {
      addMultipleDirect(direct, weight, key)
      continue
    }

    nomalDirects[weight] = direct[key]
  }

  // 按照指令的权重进行指令的编译
  // 我们只在 for 指令第一次进入的时候只执行 for 指令，后续复制的 vnodeconf 都需要全部执行
  for (let w = W.DIRECTLENGTH - 1; w > -1; w--) {
    if (!nomalDirects[w]) continue
    const directValue = nomalDirects[w]
    const execResult = executSingleDirect(w, directValue, node, comp, vnodeConf)

    if (node.for) return
    if (execResult === false) return false
  }

  function addMultipleDirect (direct, weight, key) {
    const detail = {
      attrName: key.split(':')[1].trim(),
      value: direct[key],
    }

    !nomalDirects[weight]
      ? nomalDirects[weight] = [detail]
      : nomalDirects[weight].push(detail)
  }

  // 清除重复的指令，但是需要排除 event 和 bind 指令
  function isSameDirect (weight) {
    return (
      weight !== W.BIND &&
      weight !== W.ON &&
      weight === currentWeight
    )
  }

  function isMultipleDirect (weight) {
    return weight === W.BIND || weight === W.ON
  }
}

function parseStaticNode (node, comp, vnodeConf) {
  const code = `
    with ($obj_) {
      function _s (_val_) { return _val_ };
      return ${node.expression};
    }
  `
  vnodeConf.content = runExecuteContext(code, comp)
}

function executSingleDirect (weight, val, node, comp, vnodeConf) {
  switch (weight) {
    case W.SHOW :
      show(val, comp, vnodeConf)
      break
    case W.FOR :
      vfor(node, comp, vnodeConf)
      break
    case W.ON :
      vevent(node, val, comp, vnodeConf)
      break
    case W.TEXT :
      text(val, comp, vnodeConf)
      break
    case W.BIND :
      bind(val, comp, vnodeConf)
      break
    case W.IF :
      return vif(node, val, comp, vnodeConf)
  }
}