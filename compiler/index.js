import { parseHtml } from './parse-html'
import { optimize } from './static-optimize'
import { createVnodeTree } from './create_render'
import { extend } from '../utils'

let dom
export function createAst (html) {
	const ast = parseHtml(html.trim())
	optimize(ast[0] || {})

	return ast
}

export function createComponent (component) {
	const astObj = {ast: {}}
	component = extendComponent(component, astObj)
	astObj.ast = createAst(component.template)
	return createVnodeTree(astObj.ast, component)
}

function extendComponent (component, astObj) {
	return extend(component, {
		setState (state) {
			setState(component, astObj, state)
		}
	})
}

function setState (component, astObj, state) {
	component.state = Object.assign({}, component.state, state)

	const newDom = createVnodeTree(astObj.ast, component).render()
	const root = document.getElementById('root')

	root.removeChild(dom)
	root.appendChild(newDom)

	dom = newDom
}

export function mount (root, component) {
	dom = component.render()
	document.getElementById('root').appendChild(dom)
}