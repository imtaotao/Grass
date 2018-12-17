import * as _ from '../utils/index'
import { TAG } from '../ast/parse-template'
import { WidgetVNode } from './component-vnode'
import { createVNode } from './create-vnode'
import { getSlotVNode, pushSlotVNode } from './component-slot'
import { createAsyncComponent } from './component-async'
import { migrateComponentStatus } from './component-transfer'
import complierDirectFromAst from '../directives/index'

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

            if (vnode) {
              pushSlotVNode(vnodeChildren, vnode)
            }
          }
        } else {
          // If a component tag
          let childClass = getComponentClass(child, component)
          
          // If a async component
          if (childClass.async) {
            const { factory, cb } = childClass
            childClass = createAsyncComponent(factory, component, cb)
            // If no childClass, represent no loading component or other component.
            if (!childClass) { 
              // We don't need placeholder vnode, not render just fine.
              continue
            }
          }

          const slotVNode = genChildren(child.children, component)
          const vnode = new WidgetVNode(component, child, slotVNode, childClass)

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