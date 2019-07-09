import * as _ from '../utils'
import { getProps } from './index'
import { render } from './render'
import { create } from '../virtual-dom'
import { updateDomTree } from './update-state'
import { shouldForceUpdate } from './component-transfer'
import { getComponentInstance } from './component-instance'
import { elementCreated } from '../global-api/custom-directive'

export class WidgetVNode {
  constructor (parentComponent, parentConfig, slotVNode, componentClass) {
    const {
      attrs = {},
      haveShowTag,
      vTransitionType,
      vTransitionData,
      customDirection,
    } = parentConfig

    this.count = 0
    this.type = 'Widget'
    this.component = null
    this.slot = attrs.slot
    this.name = componentClass.name
    this.componentClass = componentClass
    this.parentComponent = parentComponent
    this.id = '_' + this.name + (parentConfig.indexKey || '')
    this.data = {
      haveShowTag,
      vTransitionType,
      vTransitionData,
      customDirection,
      parentConfig,
      slotVNode,
    }

    this.container = {
      vtree: null,
      dom: null,
    }
  }

  init () {
    // Now, we can get component instance, chonse this time, Because we can improve efficiency
    const parentComponent = this.parentComponent
    const component = getComponentInstance(this, parentComponent)

    component.$slot = this.data.slotVNode
    component.$widgetVNode = this
    this.component = component

    const { dom, vtree } = renderingRealDom(this)

    component.$el = dom
  
    if (parentComponent) {
      const ref = this.data.parentConfig.attrs.ref
      component.$parent = parentComponent

      if (typeof ref === 'string' || typeof ref === 'number') {
        if (parentComponent.$children[ref]) {
          _.grassWarn(
            `The component instance "${ref}" already exists, please change the ref name`,
            component.name
          )
        } else {
          parentComponent.$children[ref] = component
        }
      }
    }

    cacheComponentDomAndVTree(this, vtree, dom)
    component.$data.created = true

    if (!component.noStateComp) {
      component.created(dom)
    }

    return dom
  }

  update (previousVnode, dom) {
    // We need update old component state, so, make new vnode state transfer to old vnode
    transferData(this, previousVnode)
    update(this)
   
    return dom
  }

  destroy (dom) {
    // we need call all child component destroy hook
    destroyChildComponent(this.container.vtree)

    if (typeof this.component.destroy === 'function') {
      this.component.destroy(dom)
    }
    this.component.$isDestroyed = true
  }

  elementCreated (dom, node) {
    elementCreated(dom, this.data.customDirection)
  }
}

export function renderingRealDom (widgetVNode) {
  const { componentClass } = widgetVNode
  const ast = componentClass.$ast

  const vtree = render(widgetVNode, ast)
  const dom = create(vtree)

  return { dom, vtree }
}

export function cacheComponentDomAndVTree (widgetVNode, vtree, dom) {
  widgetVNode.container.vtree = vtree
  widgetVNode.container.dom = dom 
}

function update ({ component, data: { parentConfig } }) {
  if (component && parentConfig) {
    const { $propsRequireList, name } = component
    const newProps = getProps(parentConfig.attrs, $propsRequireList, name)

    if (!component.noStateComp && 
      component.willReceiveProps(newProps, shouldForceUpdate(parentConfig)) === false) {
      return
    } else if (component.noStateComp) {
      const empty = () => empty
      // Update new props, props maybe changed in function component.
      component.constructor.call(component, newProps, empty, component.$parent)
    }

    component.props = newProps
    !component.noStateComp && component.didReceiveProps()
    updateDomTree(component)
  }
}

 /**
  * We need transfer component、componentClass、container,
  * And need let widgetVNode of component change to new widgetVNode
  **/
function transferData (nv, ov) {
  nv.component = ov.component
  nv.componentClass = ov.componentClass
  nv.container = ov.container

  nv.component.$widgetVNode = nv
  nv.component.$slot = nv.data.slotVNode
}

function destroyChildComponent ({ children }) {
  for (let i = 0, len = children.length; i < len; i++) {
    const VNode = children[i]

    if (_.isWidget(VNode)) {
      const component = VNode.component
      const { vtree, dom } = VNode.container
      
      destroyChildComponent(vtree)

      if (!component.noStateComp && typeof component.destroy === 'function') {
        component.destroy(dom)
      }
    }
  }
}