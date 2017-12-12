import * as _ from './util'

const REPLACE = 'replace' // replace
const REORDER = 'reorder' // reorder
const PROPS   = 'props'	  // props
const TEXT    = 'text'    // text

function patch (node, patches) {
	_.log(node)
	const walker = { index: 0 }
	deepWalk(node, walker, patches)
}

// The node is true node 
function deepWalk (node, walker, patches) {
	// current patch
	const currentPatches = patches[walker.index]
	_.log(node, walker.index, currentPatches)
	// If the node has chidren
	if (node.childNodes) {
		const length = node.childNodes.length
		for (let i = 0; i < length; i++) {
			const child = node.childNodes[i]
			// if (child.nodeType !== 3) {
				walker.index++
				deepWalk(child, walker, patches)
			// } else {
			// 	console.log(child)
			// }
		}
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
				break
			case REORDER :
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
	// _.log(node, props)
	_.each(props, (value, key) => {
		_.setAttr(node, key, value)
	})
}

// replace new node
function replaceNode (oldN, newN) {

}

// reorder the children
function reorderChildren (node, moves) {

}







patch.REORDER = REORDER
patch.REPLACE = REPLACE
patch.PROPS   = PROPS
patch.TEXT    = TEXT

export default patch