import * as _ from '../utils'
import createElement from './overrides'
import render from './render'
import { removeCache } from './cache-component'

export default function createCompVnode (parentConf, parentComp, comp) {
  if (comp.$cacheState.componentElement) {
    return comp.$cacheState.componentElement
  }

  const vnode = createNewCompVnode(parentConf, parentComp, comp)

  _.setOnlyReadAttr(vnode, 'customDirection',
    parentConf.customDirection || null)

  comp.$cacheState.componentElement = vnode
  return vnode
}

function createNewCompVnode (parentConf, parentComp, comp) {
  function ComponentElement () {}

  ComponentElement.prototype.type = 'Widget'

  // 我们构建的这个组件节点现在并没有一个子元素，否则会在 patch 的时候计算错误
  ComponentElement.prototype.count = 0

  ComponentElement.prototype.init = function() {
    return createRealDom(parentConf, comp)
  }

  ComponentElement.prototype.update = function(previous, domNode) {
    console.log('component update', previous, domNode);
  }

  ComponentElement.prototype.destroy = function(dom) {
    // 组件销毁需要清除缓存
    removeCache(parentComp, parentConf.tagName, comp)
    if (!comp.noStateComp) {
      comp.destroy(dom)
    }
  }

  return new ComponentElement
}

export function createRealDom (parentConf, comp) {
  const ast = comp.constructor.$ast

  if (comp.noStateComp) {
    const vTree = render(parentConf, ast, comp)
    const dom = createElement(comp, vTree)
    return dom
  }

  comp.createBefore()
  const vTree = render(parentConf, ast, comp)
  const dom = createElement(comp, vTree)

  comp.$cacheState.dom = dom
  comp.$cacheState.vTree = vTree

  comp.create(dom)

  return dom
}