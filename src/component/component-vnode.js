import * as _ from '../utils'
import { getProps } from './index'
import { render } from './render'
import { create } from '../virtual-dom'
import { elementCreated } from '../global-api/constom-directive'
import { getComponentInstance } from './component-instance'

export class WidgetVNode {
  constructor (parentComponent, parentConfig, slotVnode, componentClass) {
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
    this.id = '_' + this.name + parentConfig.indexKey
    this.data = {
      haveShowTag,
      vTransitionType,
      vTransitionData,
      customDirection,
      parentConfig,
      slotVnode,
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

    component.$slot = this.data.slotVnode
    component.$widgetVNode = this
    this.component = component

    const { dom, vtree } = renderingRealDom(this)

    component.$el = dom
  
    if (parentComponent) {
      component.$parent = parentComponent
      parentComponent.$children[component.name] = component
    }

    cacheComponentDomAndVTree(this, vtree, dom)

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
    if (typeof this.component.destroy === 'function') {
      this.component.destroy(dom)
    }
  }

  elementCreated (dom, node) {
    elementCreated(dom, this.data.customDirection)
  }
}

export function renderingRealDom (widgetVNode) {
  const { component, componentClass } = widgetVNode
  const ast = componentClass.$ast

  if (!component.noStateComp) {
    component.createBefore()
  }

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
        component.willReceiveProps(newProps) === false) {
      return
    } else if (component.noStateComp) {
      // Update new props, props maybe changed in function component.
      component.constructor.call(component, newProps, component.$parent)
    }

    component.props = newProps
    component.forceUpdate()
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
  nv.component.$slot = nv.data.slotVnode
}