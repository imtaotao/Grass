import { diff, patch, create } from 'virtual-dom'
import { parseHtml } from './ast/parse_html'
import { optimize } from './ast/static_optimize'
import { createVnodeTree } from './vnode'
import * as _ from './utils'

// 我们现在对状态的变化统一对整个 virtul dom 树进行 diff
// 对整个 real dom 进行更改
// 后续进行优化，针对每个单独的 vnode 进行 diff
let dom
let oldVnode
export function createComponent (component) {
	if (!_.isString(component.template)) {
		return _.warn('Component template must a "string"')
	}
	return extendComponent(component)()
}

export function mount (root, component) {
	oldVnode = component.$createVnode('Root').vnode
	dom = create(oldVnode)

	root.appendChild(dom)
}

function extendComponent (component) {
	return function () {
		let _ast = null
		let _v = { vnode: null }

		// 带 $ 号的是内部方法
		const newComponent = _.extend(component, {
			setState: getSetState(component),
			$createVnode (componentName) {
				// 每次产生一个新的 vnode 都会重新编译一遍指令
				// 我们采用对象引用的方式，保证每个子组件的 vnode 变化都会
				// 响应到其对应的父组件 vnode 中
				_v.vnode = createVnodeTree(_ast, newComponent, componentName)
				return _v
			}
		})

		_ast = createAst(newComponent.template)
		return newComponent
	}
}

function createAst (html) {
	const ast = parseHtml(html.trim())
	optimize(ast[0] || {})

	return ast
}

function getSetState (component) {
	let flag = true
	return function setState (state) {
		component.state = Object.assign({}, component.state, state)

		if (flag) {
			flag = false
			Promise.resolve().then(() => {
				const newVnode = component.$createVnode().vnode
				const patchs = diff(oldVnode, newVnode)

				patch(dom, patchs)

				oldVnode = newVnode
				flag = true
			})
		}
	}
}