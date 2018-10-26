import * as _ from '../utils/index'
import { TAG } from '../ast/parse-template'
import { WidgetVNode } from './component-vnode'
import { createVNode } from './create-vnode'
import { getSlotVnode, pushSlotVnode } from './component-slot'
import { createAsyncComponent } from './component-async'
import { migrateComponentStatus } from './component-transfer'
import complierDirectFromAst from '../directives/index'

export function render (widgetVNode, ast) {
  const { component, data, componentClass } = widgetVNode
  const vnodeConfig = complierDirectFromAst(ast, component)

  /**
   * We need transfer some data to child component from parent component
   * example: props, slot data
  */
  if (!_.isEmptyObj(data.parentConfig)) {
    migrateComponentStatus(data.parentConfig, vnodeConfig)
  }
  

  // deal with css modules hook function
  if (typeof componentClass.CSSModules === 'function') {
    componentClass.CSSModules(vnodeConfig, component.name)
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
            const vnode = getSlotVnode(child.attrs.name, component)

            if (vnode) {
              pushSlotVnode(vnodeChildren, vnode)
            }
          }
        } else {
          // If a component tag
          let childClass = getComponentClass(child, component)
          
          // If a async component
          if (childClass.async) {
            const factory = childClass.factory
            childClass = createAsyncComponent(factory, component)
            // If no childClass, represent no loading component or other component.
            if (!childClass) {
              // We don't need placeholder vnode, not render just fine.
              continue
            }
          }

          const slotVnode = genChildren(child.children, component)
          const vnode = new WidgetVNode(component, child, slotVnode, childClass)

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
    parentCompnent.component = childComponents = childComponents()
  }

  if (_.isPlainObject(childComponents)) {
    const res = childComponents[tagName]

    if (res) {
      return res
    }
  }

  warn()
}