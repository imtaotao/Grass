import VPatch from '../vnode/vpatch'
import diffProps from './diff-props'
import { reorder } from './reorder';
import { isVNode, isVText, isWidget } from '../vnode/typeof-vnode'

export default function diff (a, b) {
  const patch = { a }
  walk(a, b, patch, 0)
  return patch
}

function walk (a, b, patch, index) {
  if (a === b) {
    return
  }

  let apply = patch[index]
  let applyClear = false

  if (isUndef(b)) {
    if (!isWidget(a)) {
      destroyWidgets(a, patch, index)
      // 此时的 patch[index] 可能已经改变，有 thunk 函数的情况下
      // applyClear = true
      apply = patch[index]
    }

    apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
  } else if (isVNode(b)) {
    if (isVNode(a) && isSameVnode(a, b)) {
      const propsPatch = diffProps(a.properties, b.properties)

      if (propsPatch) {
        apply = appendPatch(apply, new VPatch(VPatch.PROPS, a, propsPatch))
      }

      apply = diffChildren(a, b, patch, apply, index)
    } else {
      // a 有可能是 vnode、text 和 widget
      applyClear = true
      apply = appendPatch(apply, new VPatch(VPatch.vNode, a, b))
    }
  } else if (isVText(b)) {
    if (!isVText(a)) {
      // 此时 a 为 vnode 或者 widget
      apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
      applyClear = true
    } else if (a.text !== b.text) {
      apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
    }
  } else if (isWidget(b)) {
    if (!isWidget(a)) {
      applyClear = true
    }

    apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
  }

  // 我们只记录有变化的，apply 记录着当前这个 vnode 的变化
  // 比如 props 子元素的增删，移动等，可能是一个数组
  if (apply) {
    patch[index] = apply
  }

  if (applyClear) {
    destroyWidgets(a, patch, index)
  }
}

function destroyWidgets (vNode, patch, index) {
  if (isWidget(vNode)) {
    // 我们对 widget 节点进行 patch 主要是为了调用 destroy
    // 不然我们在直接替换节点的时候就把这个 widget 直接删掉了都不用管
    if (typeof vNode.destroy === 'function') {
      patch[index] = new VPatch(VPatch.REMOVE, vNode, null)
    }
  } else if (isVNode(vNode) && vNode.hasWidgets) {
    const children = vNode.children
    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i]
      index++

      destroyWidgets(child, patch, index)

      if (isVNode(child) && child.count) {
        index += child.count
      }
    }
  }
}

function diffChildren(a, b, patch, apply, index) {
  const aChildren = a.children
  const orderedSet = reorder(aChildren, b.children)
  const bChildren = orderedSet.children

  const aLen = aChildren.length
  const bLen = bChildren.length
  const len = aLen > bLen ? aLen : bLen

  for (let i = 0; i < len; i++) {
    const leftNode = aChildren[i]
    const rightNode = bChildren[i]
    index++

    if (leftNode) {
      walk(leftNode, rightNode, patch, index)
    } else {
      // 如果没有 leftNode 但是有 rightNode，那就是新增的
      if (rightNode) {
        apply = appendPatch(apply, new VPatch(VPatch.INSERT, null, rightNode))
      }
    }

    if (isVNode(leftNode) && leftNode.count) {
      index += leftNode.count
    }
  }

  // 如果我们有需要移动的子节点，我们放在最后处理，等子节点处理后再进行排序移动等
  if (orderedSet.moves) {
    apply = appendPatch(apply, new VPatch(VPatch.ORDER, a, orderedSet.moves))
  }

  return apply
}

function appendPatch(apply, patch) {
  if (apply) {
    Array.isArray(apply)
      ? apply.push(patch)
      : apply = [apply, patch]

    return apply
  }
  return patch
}

function isSameVnode (a, b) {
  return (
      a.tagName === b.tagName &&
      a.namespace === b.namespace &&
      a.key === b.key
  )
}

function isUndef (v) {
  return v === undefined || v === null
}