import * as W from './weight'
import * as _ from '../utils'
import bind from './bind'
import vevent from './event'
import vfor from './for'
import vif from './if'
import show from './show'
import text from './text'
import runExecutContext from './execution_env'
import { TAG, TEXT, STATICTAG } from '../ast/parse_template'

/**
 *  vnodeConf 作为一个创建 vnodeTree 的配置项
 *  避免每次 diff 创建 vnode 都需要对整个 ast 进行复制编译
 *  因为现在没有办法做到针对单个指令进行编译
 *  所以我们只能尽量降低每次编译指令时的开销
 *  ：
 *    {
 *      type: TAG | TEXT | STATICTAG
 *      tagName ?: string
 *      children : array
 *      content ?: string 
 *    }
 */

export default function complierAst (nodes, comp) {
  const state = comp.state
  const vnodeConf = {}
  
  if (_.isFunction(state)) {
    const res = state()
    _.isPlainObject(res)
      ? comp.state = res
      : _.warn(`Component "state" must be a "Object"  \n\n  ---> ${comp.name}\n`)
  }

  return complierMultipleNode(nodes, comp)
}

export function complierMultipleNode (nodes, comp, vnodeConf) {
  for (let i = 0; i < nodes.length; i++) {
    parseSingleNode(nodes[i], comp, )
  }
  return nodes
}

export function parseSingleNode (node, comp) {
  if (isCustomComp(node)) return

  switch (node.type) {
    case TAG :
      const res = parseTagNode(node, comp)
      // 当 node 的 v-if 为 false 的时候，就没必要便利子元素了
      if (res === false)
        return

    case STATICTAG :
      parseStaticNode(node, comp)
  }

  // 继续递归便利子节点，for 指令处理过的除外，因为已经在处理的时候顺带把子指令处理了
  if (!node.for && node.children) {
    complierMultipleNode(node.children, comp)
  }
}

function parseTagNode (node, comp) {
  if (node.tagName === 'template') {
    isLegalComp(node, comp.name)
    node.tagName = 'div'
  }

  // 处理有指令的情况，我们会在每个指令的执行过程中进行递归调用，编译其 children
  if (node.hasBindings()) {
    return complierDirect(node, comp)
  }
}

function complierDirect (node, comp) {
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

    const execResult = executSingleDirect(w, directValue, node, comp)

    // 我们需要判断 v-if，如果是 false 我们根本就没有必要继续下去
    if (execResult === false && w === W.IF) {
      node.type = TEXT
      node.content = ''
      node.tagName = null
      node.children = []
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

function parseStaticNode (node, comp, ) {
  const code = `
    with ($obj_) {
      function _s (_val_) { return _val_ };
      return ${node.expression};
    }
  `

  node.content = runExecutContext(code, comp)
}

function executSingleDirect (weight, val, node, comp) {
  switch (weight) {
    case W.SHOW :
      show(node, val, comp)
      break
    case W.FOR :
      vfor(node, comp)
      break
    case W.ON :
      vevent(node, val, comp)
      break
    case W.TEXT :
      text(node, val, comp)
      break
    case W.BIND :
      bind(node, val, comp)
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
        return _.warn(`Template component can only have one child element  \n\n  --->  [${compName}]\n`)
      }
    }
  }
}

function isCustomComp (node) {
  return node.type === TAG && !node.isHTMLTag && !node.isSvgTag
}
