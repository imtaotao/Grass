import * as _ from './util'

class vnode {
	constructor (tagName, props = {}, children = []) {
		if (!tagName) { return }
		this.tagName  = tagName
		if (Array.isArray(props)) {
			children = props
			props = null
		}
		this.setParam(tagName, props, children)
	}

	setParam (tagName, props, children) {
		this.props    = props || {}
		this.key      = props ? props.key : undefined
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