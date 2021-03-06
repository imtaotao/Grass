import * as _ from '../../utils/index'
import VPatch from '../vnode/vpatch'
import applyProperties from './apply-properties'
import { leave, applyPendingNode } from './transition'
import { isWidget } from '../vnode/typeof-vnode'

export default function applyPatch (vpatch, domNode, renderOptions) {
  const { type, vNode, patch } = vpatch

  switch (type) {
    case VPatch.REMOVE :
      return removeNode(domNode, vNode)
    case VPatch.INSERT :
      return insertNode(domNode, patch, renderOptions)
    case VPatch.VTEXT :
      return stringPatch(domNode, patch, renderOptions)
    case VPatch.WIDGET :
      return widgetPatch(domNode, vNode, patch, renderOptions)
    case VPatch.VNODE :
      return vNodePatch(domNode, patch, renderOptions)
    case VPatch.ORDER :
      reorderChildren(domNode, patch)
      return domNode
    case VPatch.PROPS :
      applyProperties(domNode, vNode, patch, vNode.properties)
      return domNode
    default :
      return domNode
  }
}

function removeNode (domNode, vNode) {
  const remove = _.once(() => {
    const parentNode = domNode.parentNode

    if (parentNode) {
      parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode)
  })

  leave(domNode, vNode, remove)

  return null
}

// 不需要再插入的时候添加 flip 动画，我们所有的 enter 动画都在 createElement 里面
function insertNode (parentNode, vNode, renderOptions) {
  // 移除正在动画的元素
  applyPendingNode(parentNode)

  const newNode = renderOptions.render(vNode)

  if (parentNode) {
    parentNode.appendChild(newNode)
  }

  return parentNode
}

function stringPatch (domNode, vText, renderOptions) {
  if (domNode.nodeType === 3) {
    domNode.replaceData(0, domNode.length, vText.text)
    return domNode
  }

  const parentNode = domNode.parentNode
  const newNode = renderOptions.render(vText)
  
  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode)
  }

  return newNode
}

function widgetPatch (domNode, leftVNode, widget, renderOptions) {
  const updating = updateWidget(leftVNode, widget)

  let newNode = updating
    ? widget.update(leftVNode, domNode) || domNode
    : renderOptions.render(widget)

  const parentNode = domNode.parentNode

  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode)
  }

  if (!updating) {
    destroyWidget(domNode, widget)
  }

  return newNode
}

function vNodePatch (domNode, vNode, renderOptions) {
  const parentNode = domNode.parentNode
  const newNode = renderOptions.render(vNode)

  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode)
  }

  return newNode
}

function reorderChildren (domNode, moves) {
  const childNodes = domNode.childNodes
  const { removes, inserts } = moves
  const keyMap = {}


  for (var i = 0, len = removes.length; i < len; i++) {
    const remove = removes[i]
    const node = childNodes[remove.from]

    // remove.key 有可能为 null
    if (remove.key) {
      // 保存 node，移动时复用 dom 节点
      keyMap[remove.key] = node
    }

    domNode.removeChild(node)
  }

  let length = childNodes.length
  for (let j = 0, len = inserts.length; j < len; j++) {
    const insert = inserts[j]
    const node = keyMap[insert.key]

    // virtual-dom 这个库的作者说这是他见过的最奇怪的 bug，所以这里把 undefined 换成了 null
    // 具体啥 bug，不清楚 😂
    domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
  }
}

function destroyWidget(domNode, w) {
  if (typeof w.destroy === 'function' && isWidget(w)) {
    w.destroy(domNode)
  }
}

function updateWidget (a, b) {
  if (isWidget(a) && isWidget(b)) {
    return 'name' in a && 'name' in b
      ? a.id === b.id
      : a.init === b.init
  }

  return false
}