import * as _ from '../utils'

const REPLACE = 'replace' // replace
const REORDER = 'reorder' // reorder
const PROPS = 'props'   // props
const TEXT = 'text'    // text

export function patch (node, patches) {
  const walker = { index: 0 }
  deepWalk(node, walker, patches)
}

// The node is true node
function deepWalk (node, walker, patches) {
  // current patch
  const currentPatches = patches[walker.index]
  // If the node has chidren
  if (node.childNodes) {
    const length = node.childNodes.length
    _.each(node.childNodes, child => {
      walker.index++
      deepWalk(child, walker, patches)
    })
  }

  if (currentPatches) {
    applyPatches(node, currentPatches)
  }

}

function applyPatches (node, currentPatches) {
  _.each(currentPatches, (currentPatch, key) => {
    switch (currentPatch.type) {
      case TEXT :
        setText(node, currentPatch.content)
        break
      case PROPS :
        setProps(node, currentPatch.props)
        break
      case REPLACE :
        replaceNode(node, currentPatch.node)
        break
      case REORDER :
        reorderChildren(node, currentPatch.moves)
        break
      default :
        throw Error(`Unknown patch type ${currentPatch.type}`)
    }
  })
}

// Reset text
function setText (node, text) {
  node[
    node.textContent
      ? 'textContent'
      : 'nodeValue'
  ] = text
}

// Reset the node's props
function setProps (node, props) {
  _.each(props, (value, key) => {
    _.setAttr(node, key, value)
  })
}

// replace new node
function replaceNode (oldN, node) {
  console.log(oldN, node);
  const newN = _.isString(node)
    ? document.createTextNode(node)
    : node.render()

  oldN.parentNode.replaceChild(newN, oldN)
}

// reorder the children
function reorderChildren (nodes, moves) {
  const maps = {}
  const nodeList = Array.from(nodes.childNodes)

  _.each(nodeList, node => {
    // If element node, record the element's `key` prop
    // According to `key` let real-dom and vdom connection
    if (node.nodeType === 1) {
      const key = node.getAttribute('key')
      key && (maps[key] = node)
    }
  })

  _.each(moves, move => {
    const {index, type} = move
    // remove item
    if (type === 0) {
      // Because the `childNodes` is dynamic, so need judge in real time.
      if (nodeList[index] === nodes.childNodes[index]) {
        nodes.removeChild(nodes.childNodes[index])
      }
      nodeList.splice(index, 1)
    }

    // insert item
    if (type === 1) {
      const item = maps[move.item.key]
      let insertNode
      // If has a item, reuse old item
      if (item) {
        insertNode = item.cloneNode(true)
      }
      // Render new item or text
      else {
        insertNode = _.isString(move.item)
          ? document.createTextNode(move.item)
          : move.item.render()
      }

      nodeList.splice(index, 0, insertNode)
      nodes.insertBefore(insertNode, nodes.childNodes[index] || null)
    }
  })
}

patch.REORDER = REORDER
patch.REPLACE = REPLACE
patch.PROPS = PROPS
patch.TEXT = TEXT

export default patch