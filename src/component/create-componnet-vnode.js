import * as _ from '../utils/index'
import render from './render'
import { create } from '../virtual-dom/index'
import { removeCache } from './cache-component'
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
    this._name = comp.name
  }

  WidgetElement.prototype.type = 'Widget'

  // 我们构建的这个组件节点现在并没有一个子元素，否则会在 patch 的时候计算错误
  WidgetElement.prototype.count = 0

  WidgetElement.prototype.customDirection = parentConf.customDirection || null

  WidgetElement.prototype.init = function() {
    return createRealDom(parentConf, comp)
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