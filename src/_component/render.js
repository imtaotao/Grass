import * as _ from '../utils/index'
import { WidgetVNode } from './component-vnode'
import { createVNode } from './createElement'
import complierDirectFromAst from '../directives/index'

export function render (widgetVNode, ast) {
  const { component, parentConfig, componentClass } = widgetVNode
  const vnodeConfig = complierDirectFromAst(ast, component)

  /**
   * We need transfer some data to child component from parent component
   * example: props
  */
  _.migrateCompStatus(parentConfig, vnodeConfig)

  // deal with css modules hook function
  if (typeof componentClass.CSSModules === 'function') {
    componentClass.CSSModules(vnodeConfig, component.name)
  }

  return createVNode(vnodeConfig, genChildren(vnodeConfig.children, component))
}

export function genChildren (children, compnent) {
  const vnodeChildren = []

  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i]
    if (child) {
      if (child.type === TAG) {
        // If is a reserved tag
        if (_.isReservedTag(child.tagName)) {
          const vnode = createVNode(child, genChildren(child.children, component))
          vnodeChildren.push(vnode)
        } else {
          // If a component tag
          const childCompoentClass = getComponentClass(child, compnent)
          const vnode = new WidgetVNode(child, childCompoentClass)
          vnodeChildren.push(vnode)
        }
      } else {
        const content = _.toString(child.content)
        if (content.trim()) {
          vnodeChildren.push(content)
        }
      }
    }
  }

  return vnodeChildren
}


function getComponentClass (vnodeConfig, parentCompnent) {
  let childComponents = parentCompnent.component
  const { tagName } = vnodeConfig
  const warn = () => {
    _.grassWarn(`Component [${tagName}] is not registered`, parentCompnent.name)
  }

  if (!childComponents) {
    warn()
    return null
  }

  // 'components' attribute of component is function or object, so, we need judgment
  if (typeof childComponents === 'function') {
    childComponents = childComponents()
  }

  if (_.isPlainObject(childComponents)) {
    return childComponents[tagName]
  }

  warn()
}