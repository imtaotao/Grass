import { h, create } from 'virtual-dom'
import { complierTemplate } from './directives'
import * as _ from './utils'
import { TAG } from './ast/parse_html'

export function createVnodeTree (ast, component, compName) {
  const newAst =  complierTemplate(_.copyNode(ast), component, compName)

  return handleNode(newAst[0], newAst, component, compName)[0]
}

function handleNode (parent, nodes, comp, compName) {
  return nodes.map(child => {
    if (child.type === TAG) {
      if (!child.isHTMLTag && !child.isSvgTag) {
        let res
        if (!_.isObject(comp.component) || !(res = comp.component[child.tagName])) {
          return _.warn(`Component [${child.tagName}] is not registered  \n\n  --->  [${compName}]\n`)
        }

        // 构建引导属性，我们会在这个标识的真实 dom 中插入子元素
        return createComment(res, child.tagName)
      }

      return h(
        child.tagName,
        child.attrs,
        handleNode(child, child.children, comp, compName)
      )
    }

    return child.content
  })
}


function createComment (comp, compName) {
  const vnode = comp.$createVnode(compName).vnode
  const dom = create(vnode)
  comp.$renderState({ dom, vnode })

  function el () {}
  el.prototype.type = 'Widget'
  el.prototype.count = 1
  el.prototype.init = function() {
    const stat = comp.$renderState()
    if (!stat) {
      const vnode = comp.$createVnode(compName).vnode
      const dom = create(vnode)
      comp.$renderState({ dom, vnode })

      return dom
    }

    return stat.dom
  }

  el.prototype.update = function(previous, domNode) {
    console.log(previous, domNode);
  }

  el.prototype.destroy = function(domNode) {
    console.log(domNode)
  }

  return new el
}