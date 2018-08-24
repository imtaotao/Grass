const noChild = {}

// 我们查找真是需要进行 patch 的真实节点，这样我们就不用遍历所有的节点
export default function domIndex (rootNode, tree, indices) {
  if (!indices || !indices.length) {
    return {}
  }

  indices.sort((a, b) => a > b)
  return recurse(rootNode, tree, indices, null, 0)
}

function recurse (rootNode, tree, indices, nodes, rootIndex) {
  nodes = nodes || {}

  if (rootNode) {
    if (indexInRange(indices, rootIndex, rootIndex)) {
      nodes[rootIndex] = rootNode
    }

    const vChildren = tree.children

    if (vChildren) {
      const childNodes = rootNode.childNodes

      for (let i = 0, len = vChildren.length; i < len; i++) {
        rootIndex++

        const vChild = vChildren[i] || noChild
        const nextIndex = rootIndex + (vChild.count || 0)

        // 此处我们过滤掉了不需要的真实节点
        if (indexInRange(indices, rootIndex, nextIndex)) {
          recurse(childNodes[i], vChild, indices, nodes, rootIndex)
        }

        // 如果进入到了子节点的查找，我们这里的 rootIndex 要加上子节点的数量
        // 把 dom 节点从多维的数据结构降低到一维，我们在生成 vnode 和 diff 的时候都会这样处理
        rootIndex = nextIndex
      }
    }
  }

  return nodes
}

// 需要变动的位置是否存在于真实节点之中
function indexInRange (indices, left, right) {
  if (!indices.length) {
    return false
  }

  let minIndex = 0
  let maxIndex = indices.length - 1
  let currentIndex
  let currentItem

  while (minIndex <= maxIndex) {
    currentIndex = ((maxIndex + minIndex) / 2) >> 0
    currentItem = indices[currentIndex]

    if (minIndex === maxIndex) {
      // 代表在范围之内
      return currentItem >= left && currentItem <= right
    } else if (currentItem < left) {
      // 小于，代表 currentItem 以前的都小于 left，我们往前找
      minIndex = currentIndex + 1
    } else if (currentItem > right) {
      // 我们往后招
      maxIndex = currentIndex - 1
    } else {
      return true
    }
  }

  return false
}