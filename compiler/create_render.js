import { complierTemplate } from './compiler_order'
import { vnode, diff, patch } from '../vdom'
import { copyNode } from '../utils'
import { TAG } from './parse-html'

export function createVnodeTree (ast, component) {
  const newAst =  complierTemplate(copyNode(ast), component)

  return vnode('div', {}, handleNode(newAst))
}

function handleNode (nodes) {
  return nodes.map(child => {
    if (child.type === TAG) {
      return vnode(child.tagName, child.attrs, handleNode(child.children))
    }

    return child.content
  })
}