import * as _ from './util'
import patch from './patch'
import listDiff from 'list-diff2'

export function diff (oldTree, newTree) {
  const index   = 0
  const pathchs = {}

  return deepWalk(oldTree, newTree, index, pathchs)
}

function deepWalk (oldN, newN, index, patches) {
  if (oldN === newN) { return }
  // Contrast the difference between oldNode and newNode, record it.
  const currentPatch = []

  if (newN === null) {
    // Real dom will be removed when perform reordering
    // Dot't anthing
  }
  // If text node
  else if (_.isString(oldN) && _.isString(newN)) {
  	if (oldN !== newN) {
      currentPatch.push({
        type: patch.TEXT,
        content: newN
      }) 
    }
  }
  // Node is the same，But the properties and child of the nodes are different
  else if (
      oldN.tagName === newN.tagName &&
      oldN.key === newN.key
  ) {
    // diff props
    const propsPatches = diffProps(oldN, newN)
    propsPatches && currentPatch.push({
      type: patch.PROPS,
      props: propsPatches
    })

    // Diff child, If the node has a 'ignore' property, don't diff child
    if (!isIgnoreChild(newN)) {
      diffChild(
        oldN.children,
        newN.children,
        index,
        patches,
        currentPatch
      )
    }
  }
  // Default is replace old node.
  else {
    currentPatch.push({
      type: patch.REPLACE,
      node: newN
    })
  }
  
  currentPatch.length && (patches[index] = currentPatch)
  return patches
}
 
function diffChild (oldC = [], newC = [], index, patches, currentPatch) {
  // Write later by myself 😂
  const diffs = listDiff(oldC, newC, 'key')
  newC = diffs.children

  if (diffs.moves.length) {
    currentPatch.push({
      type: patch.REORDER,
      moves: diffs.moves
    })
  }


  let leftNode = null
  let currentNodeIndex = index
  _.each(oldC, (child, i) => {
    const newChild = newC[i]
    currentNodeIndex = leftNode && leftNode.count 
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1

    deepWalk(child, newChild, currentNodeIndex, patches)
    leftNode = child
  })
}

function diffProps (oldN, newN) {
  let count = 0
  let propsPatches = {}
  const oldProps   = oldN.props
  const newProps   = newN.props
  if (!oldProps || !newProps) { return null }
  const oldKeyName = Object.keys(oldProps)
  const newKeyName = Object.keys(newProps)
  const oLength    = oldKeyName.length
  const nLength    = newKeyName.length

  // Find out different properties
  for (let i = 0; i < oLength; i++) {
    const oVal = oldProps[oldKeyName[i]]
    const nVal = newProps[newKeyName[i]]
    if (oVal !== nVal) {
      count++
      propsPatches[oldKeyName[i]] = nVal
    }
  }

  // Find out new property
  for (let j = 0; j < nLength; j++) {
    const val = newProps[newKeyName[j]]
    if (!oldProps.hasOwnProperty(newKeyName[j])) {
      count++
      propsPatches[newKeyName[j]] = val
    }
  }

  // If properties all are identical
  if (count === 0) { return null }
  return propsPatches
}

function isIgnoreChild (node) {
  return (node.props && node.props.hasOwnProperty('ignore'))
}