const REPLACE = 'replace' // replace
const REORDER = 'reorder' // reorder
const PROPS   = 'props'	  // props
const TEXT    = 'text'    // text

function patch (node, patches) {
	const walker = { index: 0 }
	deepWalk(node, walker, patches)
}

// The node is true node 
function deepWalk (node, walker, patches) {
	// current patch
	const currentPatches = patches[walker.index]
	
	// If the node has a chidren
	if (node.childNodes) {
		const length = node.childNodes.length
		for (let i = 0; i < length; i++) {
			const child = node.childNodes[i]
			walker.index++
			deepWalk(child, walker, patches)
		}
	}

	if (currentPatches) {
		applyPatches(node, currentPatches)
	}
	
}

function applyPatches (node, currentPatches) {

}



patch.REORDER = REORDER
patch.REPLACE = REPLACE
patch.PROPS   = PROPS
patch.TEXT    = TEXT

export default patch