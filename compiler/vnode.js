import { h } from 'virtual-dom'
import { complierTemplate } from './directives'
import * as _ from './utils'
import { TAG } from './ast/parse_html'

export function createVnodeTree (ast, component, compName) {
  const newAst =  complierTemplate(_.copyNode(ast), component, compName)

  return handleNode(newAst, component, compName)[0]
}

function handleNode (nodes, comp, compName) {
  return nodes.map(child => {
    if (child.type === TAG) {
      if (!child.isHTMLTag && !child.isSvgTag) {
        let res
        if (!_.isObject(comp.component) || !(res = comp.component[child.tagName])) {
          return _.warn(`Component [${child.tagName}] is not registered  \n\n  --->  [${compName}]\n`)
        }

        return res.$createVnode(child.tagName).vnode
      }
      return h(
        child.tagName,
        child.attrs,
        handleNode(child.children, comp, compName)
      )
    }

    return child.content
  })
}