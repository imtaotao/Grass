import { complierTemplate } from './compiler_order'
import { vnode, diff, patch } from '../vdom'
import { copyNode, warn } from '../utils'
import { TAG } from './parse-html'

export function createVnodeTree (ast, component) {
  const newAst =  complierTemplate(copyNode(ast), component)

  return handleNode(newAst, component)[0]
}

function handleNode (nodes, comp) {
  return nodes.map(child => {
    if (child.type === TAG) {
      if (!child.isHTMLTag && !child.isSvgTag) {
        const res = comp.component[child.tagName]
        if (!res) {
          return warn(`Component ${child.tagName} is not registered`)
        }

        return res.$createVnode().v
      }
      return vnode(
        child.tagName,
        child.attrs,
        handleNode(child.children, comp)
      )
    }

    return child.content
  })
}