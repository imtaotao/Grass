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
	return extendComponent(component)()
}

function extendComponent (component) {
	return function () {
		let _ast = null
		let _v= { vnode: null }

		// 带 $ 号的是内部方法
		const newComponent = extend(component, {
			setState (state) {
				setState(component, state)
			},
			$createVnode () {
				return _v
			}
		})
		
		_ast = createAst(newComponent.template)
		_v.vnode = createVnodeTree(_ast, newComponent)
		return newComponent
	}
}

function setState (component, state) {
	component.state = Object.assign({}, component.state, state)

	const newDom = component.$createVnode().render()
	const root = document.getElementById('root')

	root.removeChild(dom)
	root.appendChild(newDom)

	dom = newDom
}

export function mount (root, component) {
	const vnode = component.$createVnode().vnode
	dom = vnode.render()

	console.log(dom);
	document.getElementById('root').appendChild(dom)
}