import * as _ from '../utils'
import render from './render'
import { create } from '../virtual-dom'
import { removeCache } from './cache'
import { elementCreated } from '../global-api/constom-directive'

export default function createCompVnode (parentConf, parentComp, comp) {
  const $cacheState = comp.$cacheState

  if ($cacheState.componentElement) {
    return $cacheState.componentElement
  }

  const vnode = createWidgetVnode(parentConf, parentComp, comp)

  $cacheState.componentElement = vnode

  return vnode
}

function createWidgetVnode (parentConf, parentComp, comp) {
  function WidgetElement () {
    this.name = comp.name
    this.id = parentConf.indexKey
    this.comp = comp
    this.data = Object.create(null)
    this.data.vTransitionType = parentConf.vTransitionType
    this.data.vTransitionData = parentConf.vTransitionData
    this.data.haveShowTag = parentConf.haveShowTag
    this.data.parentConf = parentConf
  }

  WidgetElement.prototype.type = 'Widget'

  // 我们构建的这个组件节点现在并没有一个子元素，否则会在 patch 的时候计算错误
  WidgetElement.prototype.count = 0

  WidgetElement.prototype.customDirection = parentConf.customDirection || null

  WidgetElement.prototype.init = function () {
    return createDomNode(parentConf, comp)
  }

  WidgetElement.prototype.update = function (previous, domNode) {
    // 沿用旧的 comp
    this.comp = previous.comp
    update(this)
    return domNode
  }

  WidgetElement.prototype.destroy = function(dom) {
    if (!comp.noStateComp) {
      comp.destroy(dom)
    }
  }

  WidgetElement.prototype.elementCreated = function (dom, node) {
    elementCreated(dom, parentConf.customDirection)
  }

  return new WidgetElement()
}

export function createDomNode (parentConf, comp) {
  const ast = comp.constructor.$ast

  if (comp.noStateComp) {
    const vtree = render(parentConf, ast, comp)
    const dom = create(vtree)

    window.u = comp
    comp.$cacheState.dom = dom
    comp.$cacheState.vtree = vtree

    return dom
  }

  comp.createBefore()

  const vtree = render(parentConf, ast, comp)
  const dom = create(vtree)

  comp.$cacheState.dom = dom
  comp.$cacheState.vtree = vtree

  comp.create(dom)

  return dom
}

function update ({comp, data: {parentConf}}) {
  console.log(comp.$cacheState.dom);
  if (comp && parentConf) {
    const newProps = _.getProps(parentConf.attrs)

    if (comp.noStateComp) {
      comp.props = newProps
      comp.setState({})
    } else {
      const needUpdate = comp.willReceiveProps(newProps)

      if (needUpdate !== false) {
        comp.props = newProps
        comp.setState({})
      }
    }
  }
}