import createElement from './overrides'
import createVnode from './create-vnode'

export default function createCompVnode (compConf, comp) {
  function ComponentElement () {}

  ComponentElement.prototype.type = 'Widget'

  // 我们构建的这个组件节点现在并没有一个子元素，否则会在 patch 的时候计算错误
  ComponentElement.prototype.count = 0

  ComponentElement.prototype.init = function() {
    comp.createBefore()
    
    const vTree = createVnode(compConf, comp)
    const dom = createElement(comp, vTree)

    comp.$cacheState.dom = dom
    comp.$cacheState.vTree = vTree

    comp.create(dom)

    return dom
  }

  ComponentElement.prototype.update = function(previous, domNode) {
    console.log(previous, domNode);
  }

  ComponentElement.prototype.destroy = function(dom) {
    comp.destroy(dom)
  }

  const vnode = new ComponentElement

  Object.defineProperty(vnode, 'customDirection', {
    get () {
      return compConf.customDirection || null
    }
  })

  return vnode
}