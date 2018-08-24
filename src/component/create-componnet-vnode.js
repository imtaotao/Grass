import * as _ from '../utils/index'
import render from './render'
import { create } from '../virtual-dom/index'
import { removeCache } from './cache-component'
import { elementCreated } from '../global-api/constom-directive'

export default function createCompVnode (parentConf, parentComp, comp) {
  if (comp.$cacheState.componentElement) {
    return comp.$cacheState.componentElement
  }

  const vnode = createWidgetVnode(parentConf, parentComp, comp)

  comp.$cacheState.componentElement = vnode
  return vnode
}

function createWidgetVnode (parentConf, parentComp, comp) {
  function WidgetElement () {}

  WidgetElement.prototype.type = 'Widget'

  // 我们构建的这个组件节点现在并没有一个子元素，否则会在 patch 的时候计算错误
  WidgetElement.prototype.count = 0

  WidgetElement.prototype.customDirection = parentConf.customDirection || null

  WidgetElement.prototype.init = function() {
    return createRealDom(parentConf, comp)
  }

  WidgetElement.prototype.update = function(previous, domNode) {
    console.log('component update', previous, domNode);
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