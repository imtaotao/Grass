import * as _ from '../utils'
import render from './render'
import { create } from '../virtual-dom'
import { elementCreated } from '../global-api/constom-directive'

export class WidgetVNode {
  constructor (parentConfig, conponentClass) {
    const {
      haveShowTag,
      vTransitionType,
      vTransitionData,
      customDirection,
    } = parentConfig

    this.type = 'Widget'
    this.count = 0
    this.name = compnent.name
    this.id = parentConfig.indexKey
    this.conponentClass = conponentClass
    this.component = null

    this.data = {
      haveShowTag,
      vTransitionType,
      vTransitionData,
      customDirection,
      parentConfig,
    }

    this.container = {
      vtree: null,
      dom: null,
    }
  }

  init () {
    // Now, we can get component instance, chonse this time, Because we can improve efficiency
    this.component = getComponentInstance(this)
    const data = renderingRealDom(this)
    cacheComponentDomAndVTree(this, data)

    return data.dom
  }

  update (previousVnode, dom) {
    // We need update old component state, so, make new vnode state transfer to old vnode
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
  const { component, compnentClass } = widgetVNode
  const ast = compnentClass.$ast

  if (component.noStateComp) {
    const vtree = render(widgetVNode, ast)
    const dom = create(vtree)

    return { dom, vtree }
  } else {
    component.createBefore()
    const vtree = render(widgetVNode, ast)
    const dom = create(vtree)
    component.create(dom)

    return { dom, vtree }
  }
}

export function cacheComponentDomAndVTree (widgetVNode, { vtree, dom }) {
  widgetVNode.container.vtree = vtree
  widgetVNode.container.dom = dom 
}

function update ({ component, data: { parentConfig } }) {
  if (component && parentConfig) {
    const newProps = _.getProps(parentConf.attrs)

    if (!component.noStateComp &&
        component.willReceiveProps(newProps) === false) {
      return
    }

    component.props = newProps
    component.setState({})
  }
}