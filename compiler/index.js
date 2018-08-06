import { parseHtml } from './parse-html'
import { optimize } from './static-optimize'
import { createRenderConf } from './create_render'
import { complierTemplate } from './compiler_order'

export function createAst (html) {
	const ast = parseHtml(html.trim())
	optimize(ast[0] || {})

	return ast
}

export function createComponent (component) {
	const ast = createAst(component.template)

	// / 我们需要把各种模板语法给解析
  const newAst = complierTemplate(ast, component)
	const renderConfig = createRenderConf(newAst)
}