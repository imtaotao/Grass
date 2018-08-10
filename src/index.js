import { diff, patch, create } from 'virtual-dom'
import { parseHtml } from './ast/parse_html'
import { optimize } from './ast/static_optimize'
import { createVnodeTree } from './vnode'
import * as _ from './utils'

export function createComponent (component) {
	if (!_.isString(component.template)) {
		return _.warn('Component template must a "string"')
	}
	return extendComponent(component)()
}

export function mount (root, component) {
	const vnode = component.$createVnode('Root').vnode
	const dom = create(vnode)

	// connectComponent(dom, component)
	component.$renderState({ dom, vnode	})

	root.appendChild(dom)
}

function extendComponent (component) {
	return function () {
		let _ast = null
		let _v = { vnode: null }

		// 带 $ 号的是内部方法
		const newComponent = _.extend(component, {
			setState: getSetState(component),
			$renderState: catchRenderDom(),
			$createVnode (componentName) {
				// 每次产生一个新的 vnode 都会重新编译一遍指令
				// 我们采用对象引用的方式，保证每个子组件的 vnode 变化都会
				// 响应到其对应的父组件 vnode 中
				_v.vnode = createVnodeTree(_ast, newComponent, componentName)
				return _v
			},
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

export function catchRenderDom () {
	let renderState = null
	return (_renderState) => {
		if (!_renderState) return renderState

		renderState = _renderState
		return _renderState
	}
}

function getSetState (component) {
	let flag = true
	return function setState (state) {
		component.state = Object.assign({}, component.state, state)

		if (flag) {
			flag = false
			Promise.resolve().then(() => {
				const compState = component.$renderState()
				const newVnode = component.$createVnode().vnode
				const patchs = diff(compState.vnode, newVnode)

				patch(compState.dom, patchs)

				compState.vnode = newVnode
				component.$renderState(compState)

				flag = true
			})
		}
	}
}