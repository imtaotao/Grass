import render from './create-element'
import domIndex from './dom-index'
import patchOp from './patch-op'

export default function patch (rootNode, patches) {
  const renderOptions = {}
  renderOptions.patch = patchRecursive
  renderOptions.render = render

  return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive (rootNode, patches, renderOptions) {
  const indices = patchIndices(patches)

  if (!indices.length) {
    return rootNode
  }

  const index = domIndex(rootNode, patches.a, indices)
  renderOptions.document = rootNode.ownerDocument

  // 对每一个需要变动的元素进行 applyPatch
  for (let i = 0, len = indices.length; i < len; i++) {
    const nodeIndex = indices[i]
    rootNode = applyPatch(rootNode, index[nodeIndex], patches[nodeIndex], renderOptions)
  }

  return rootNode
}

function applyPatch (rootNode, domNode, patchList, renderOptions) {
  if (!domNode) {
    return rootNode
  }

  if (Array.isArray(patchList)) {
    for (let i = 0, len = patchList.length; i < len; i++) {
      applySinglePatch(patchList[i])
    }
  } else {
    applySinglePatch(patchList)
  }

  return rootNode

  function applySinglePatch (_patch) {
    const newNode = patchOp(_patch, domNode, renderOptions)
    if (rootNode === domNode) {
      rootNode = newNode
    }
  }
}

function patchIndices (patches) {
  const indices = []

  for (let key in patches) {
    if (key !== 'a') {
      indices.push(Number(key))
    }
  }

  return indices
}
