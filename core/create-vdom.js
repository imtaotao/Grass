import { util } from './util'
function log (...ags) {
	console.log(ags)
}

class vnode {
	constructor (tagName, props, children) {
		if (!tagName) { return }
		this.tagName  = tagName
		this.props    = props
		this.key      = props ? props.key : null
		this.children = children || []
	}

	render () {
		const {tagName, props, children} = this
		const keyName = Object.keys(props)
		const length  = keyName.length
		const element = document.createElement(tagName)

		// set element prop
		for (let i = 0; i < length; i++) {
			element.setAttribute(keyName[i], props[keyName[i]])
		}

		// create child element
		for (let j = 0, Length = children.length; j < Length; j++) {
			const child = children[j]
			// judg child
			const childElement = (child instanceof vnode) 
				? child.render()
				: document.createTextNode(child)

			element.appendChild(childElement)
		}

		return element
	}
}

export default function (tagName, props, children) {
	return new vnode(tagName, props, children)
}