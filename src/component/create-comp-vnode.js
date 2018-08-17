import * as _ from '../utils/index'
import createElement from './overrides'
import createVnode from './create-vnode'

export default function createCompVnode (parentConf, comp) {
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
    if (!comp.noStateComp) {
      comp.destroy(dom)
    }
  }

  const vnode = new ComponentElement

  _.setOnlyReadAttr(vnode, 'customDirection',
    parentConf.customDirection || null)

  return vnode
}

export function createRealDom (parentConf, comp) {
  const ast = comp.constructor.$ast

  if (comp.noStateComp) {
    const vTree = createVnode(parentConf, ast, comp)
    const dom = createElement(comp, vTree)
    return dom
  }

  comp.createBefore()
  const vTree = createVnode(parentConf, ast, comp)
  const dom = createElement(comp, vTree)

  comp.$cacheState.dom = dom
  comp.$cacheState.vTree = vTree

  comp.create(dom)

  return dom
}