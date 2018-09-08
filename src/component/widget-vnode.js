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
    this.$name = comp.name
    this.vTransitionType = parentConf.vTransitionType
    this.vTransitionData = parentConf.vTransitionData
  }

  WidgetElement.prototype.type = 'Widget'

  // 我们构建的这个组件节点现在并没有一个子元素，否则会在 patch 的时候计算错误
  WidgetElement.prototype.count = 0

  WidgetElement.prototype.customDirection = parentConf.customDirection || null

  WidgetElement.prototype.init = function() {
    const dom = createRealDom(parentConf, comp)
    // widget 组件真实渲染出来的 dom 起始就是组件的根节点 dom
    this.$id = comp.$cacheState.vTree.$id

    return dom
  }

  WidgetElement.prototype.update = function(previous, domNode) {
    console.info('component update', comp.name);
  }

  WidgetElement.prototype.destroy = function(dom) {
    // 组件销毁需要清除缓存
    removeCache(parentComp, parentConf.tagName, comp)
    if (!comp.noStateComp) {
      comp.destroy(dom)
    }
  }

  WidgetElement.prototype.elementCreated = function (dom, node) {
    elementCreated(dom, parentConf.customDirection)
  }

  return new WidgetElement()
}

export function createRealDom (parentConf, comp) {
  const ast = comp.constructor.$ast

  if (comp.noStateComp) {
    const vTree = render(parentConf, ast, comp)
    const dom = create(vTree)

    comp.$cacheState.dom = dom
    comp.$cacheState.vTree = vTree

    return dom
  }

  comp.createBefore()

  const vTree = render(parentConf, ast, comp)
  const dom = create(vTree)

  comp.$cacheState.dom = dom
  comp.$cacheState.vTree = vTree

  comp.create(dom)

  return dom
}