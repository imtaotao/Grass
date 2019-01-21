import * as _ from '../utils/index'
import { TAG } from '../ast/parse-template'
import complierDirectFromAst from '../directives/index'
import { migrateComponentStatus } from './component-transfer'
import { getSlotVNode, pushSlotVNode } from './component-slot'
import { createVNode, createComponentVNode } from './create-vnode'

export function render (widgetVNode, ast) {
  const { component, data } = widgetVNode
  const vnodeConfig = complierDirectFromAst(ast, component)

  /**
   * We need transfer some data to child component from parent component
   * example: props, slot data
  */
  if (!_.isEmptyObj(data.parentConfig)) {
    migrateComponentStatus(data.parentConfig, vnodeConfig)
  }

  if (component.$firstCompilation) {
    component.$firstCompilation = false
  }

  return createVNode(vnodeConfig, genChildren(vnodeConfig.children, component))
}

export function genChildren (children, component) {
  const vnodeChildren = []

  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i]
    if (child) {
      if (child.type === TAG) {
        // If is a reserved tag
        if (_.isReservedTag(child.tagName)) {
          const vnode = createVNode(child, genChildren(child.children, component))
          vnodeChildren.push(vnode)
        } else if (_.isInternelTag(child.tagName)) {
          // If a slot
          if (child.tagName === 'slot') {
            const vnode = getSlotVNode(child.attrs.name, component)
            vnode && pushSlotVNode(vnodeChildren, vnode)
          }
        } else {
          // If a component tag
          const childClass = getComponentClass(child, component)
          const vnode = createComponentVNode(child, childClass, component)
          vnode && vnodeChildren.push(vnode)
        }
      } else {
        const content = _.toString(child.content)
        content.trim() && vnodeChildren.push(content)
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
    parentCompnent.component = childComponents = childComponents.call(parentCompnent)
  }

  if (_.isPlainObject(childComponents)) {
    const res = childComponents[tagName]

    if (res) {
      return res
    }
  }

  warn()
}