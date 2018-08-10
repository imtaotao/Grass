import * as W from './weight'
import * as _ from '../utils'
import bind from './bind'
import vevent from './event'
import vfor from './for'
import vif from './if'
import show from './show'
import text from './text'
import runExecutContext from './execution_env'
import { TAG, TEXT, STATICTAG } from '../ast/parse_html'

export function complierTemplate (nodes, compConf, compName) {
  const state = compConf.state
  if (_.isFunction(state)) {
    const res = state()
    _.isPlainObject(res)
      ? compConf.state = res
      : _.warn(`Component "state" must be a "Object"  \n\n  ---> ${[compName || '']}\n`)
  }

  return complierMultipleNode(nodes, compConf, compName)
}

export function complierMultipleNode (nodes, compConf, compName) {
  for (let i = 0; i < nodes.length; i++) {
    parseSingleNode(nodes[i], compConf, compName)
  }
  return nodes
}

export function parseSingleNode (node, compConf, compName) {
  if (isCustomComp(node)) return

  switch (node.type) {
    case TAG :
      const res = parseTagNode(node, compConf, compName)
      // 当 node 的 v-if 为 false 的时候，就没必要便利子元素了
      if (res === false)
        return

    case STATICTAG :
      parseStaticNode(node, compConf, compName)
  }

  // 继续递归便利子节点，for 指令处理过的除外，因为已经在处理的时候顺带把子指令处理了
  if (!node.for && node.children) {
    complierMultipleNode(node.children, compConf, compName)
  }
}

function parseTagNode (node, compConf, compName) {
  if (node.tagName === 'template') {
    isLegalComp(node, compName)
    node.tagName = 'div'
  }

  // 处理有指令的情况，我们会在每个指令的执行过程中进行递归调用，编译其 children
  if (node.hasBindings()) {
    return complierDirect(node, compConf, compName)
  }
}

function complierDirect (node, compConf, compName) {
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

    const execResult = executSingleDirect(w, directValue, node, compConf, compName)

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

function parseStaticNode (node, compConf, compName) {
  const code = `
    with ($obj_) {
      function _s (_val_) { return _val_ };
      return ${node.expression};
    }
  `

  node.content = runExecutContext(code, compConf, compName)
}

function executSingleDirect (weight, val, node, compConf, compName) {
  switch (weight) {
    case W.SHOW :
      show(node, val, compConf, compName)
      break
    case W.FOR :
      vfor(node, compConf, compName)
      break
    case W.ON :
      vevent(node, val, compConf, compName)
      break
    case W.TEXT :
      text(node, val, compConf, compName)
      break
    case W.BIND :
      bind(node, val, compConf, compName)
      break
    case W.IF :
      return vif(val, compConf, compName)
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
