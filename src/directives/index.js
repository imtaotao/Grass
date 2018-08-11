import * as W from './weight'
import * as _ from '../utils'
import bind from './bind'
import vevent from './event'
import vfor from './for'
import vif from './if'
import show from './show'
import text from './text'
import runExecuteContext from './execution_env'
import { TAG, TEXT, STATICTAG } from '../ast/parse_template'

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

export default function complierAst (nodes, comp) {
  const state = comp.state
  const vnodeConf = new nodes.constructor(nodes.length)

  setTimeout(() => console.log(vnodeConf[0]))
  
  if (_.isFunction(state)) {
    const res = state()
    _.isPlainObject(res)
      ? comp.state = res
      : _.warn(`Component "state" must be a "Object"  \n\n  ---> ${comp.name}\n`)
  }

  for (let i = 0; i < nodes.length; i++) {
    vnodeConf[i] = Object.create(null)
  }

  return complierMultipleNode(nodes, comp, vnodeConf)
}

export function complierMultipleNode (nodes, comp, vnodeConf) {
  for (let i = 0; i < nodes.length; i++) {
    // 复制一个副本
    vnodeConf[i] = _.vnodeConf(nodes[i], vnodeConf)

    parseSingleNode(nodes[i], comp, vnodeConf[i])
  }
  
  return nodes
}

export function parseSingleNode (node, comp, vnodeConf) {
  if (isCustomComp(node)) return

  switch (node.type) {
    case TAG :
      const res = parseTagNode(node, comp, vnodeConf)
      // 当 node 的 v-if 为 false 的时候，就没必要便利子元素了
      if (res === false) {
        return
      }
      break
    case STATICTAG :
      parseStaticNode(node, comp, vnodeConf)
      break
  }

  // 继续递归便利子节点，for 指令处理过的除外，因为已经在处理的时候顺带把子指令处理了
  if (!node.for && node.children) {
    complierMultipleNode(node.children, comp, vnodeConf.children)
  }
}

function parseTagNode (node, comp, vnodeConf) {
  if (node.tagName === 'template') {
    isLegalComp(node, comp.name)
    node.tagName = 'div'
  }

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
  for (let w = W.DIRECTLENGTH - 1; w > -1; w--) {
    const directValue = nomalDirects[w]
    if (!directValue) continue

    const execResult = executSingleDirect(w, directValue, node, comp, vnodeConf)

    // 我们需要判断 v-if，如果是 false 我们根本就没有必要继续下去
    if (execResult === false && w === W.IF) {
      _.removeChild(vnodeConf.parent, vnodeConf)
      return false
    }
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
      return vif(val, comp)
  }
}

function isLegalComp (node, compName) {
  let componentNumber = 0

  for (const child of node.children) {
    if (
        child.type === 2 ||
        child.expression ||
        child.content && child.content.trim()
    ) {
      componentNumber++

      if (componentNumber > 1) {
        return _.warn(`Template component can only have one child element  \n\n  --->  ${compName}\n`)
      }
    }
  }
}

function isCustomComp (node) {
  return node.type === TAG && !node.isHTMLTag && !node.isSvgTag
}
