import * as _ from '../utils'
import { h, create } from 'virtual-dom'
import { createAst } from './index'
import { TAG } from '../ast/parse_template'
import complierAst from '../directives'


export default function createVnode (comp) {
  const ast = complierAst(_.copyNode(comp.constructor.$ast), comp)

  return generatorVnode(ast, comp)[0]
}

function generatorVnode (ast, comp) {
  const vnodeTree = []

  for (let i = 0; i < ast.length; i++) {
    const node = ast[i]
    if (node.type === TAG) {
      if (!_.isReservedTag(node.tagName)) {
        
        // 自定义组件
        vnodeTree.push(createConstomComp(node, comp))
        continue
      }

      // 递归创建 vnode
      vnodeTree.push(h(
        node.tagName,
        node.attrs,
        generatorVnode(node.children, comp)
      ))

      continue
    }

    // 文本节点直接添加文件就好了，过滤掉换行空格
    if (node.content.trim()) {
      vnodeTree.push(node.content)
    }
  }

  return vnodeTree
}

function createConstomComp (node, comp) {
  let res
  const childComps = comp.component
  const errorInfor = `Component [${node.tagName}] is not registered  \n\n  --->  [${comp.name}]\n`
  
  if (!childComps) {
    _.warn(errorInfor)
    return
  }
  
  if (_.isPlainObject(childComps)) {
    res = childComps[node.tagName]
  }

  if (Array.isArray(childComps)) {
    for (let i = 0; i < childComps.length; i++) {
      if (node.tagName === childComps[i].name) {
        res = childComps[i]
        break
      }
    }
  }

  if (!res) {
    _.warn(errorInfor)
    return
  }
  
  const childComp = new res
  if (!childComp.constructor.$ast) {
    childComp.constructor.$ast = createAst(childComp)
  }

  return createSingleCompVnode(childComp)
}

function createSingleCompVnode (comp) {
  function ComponentElement () {}

  ComponentElement.prototype.type = 'Widget'
  // 我们只有一个子节点，就当前组件
  ComponentElement.prototype.count = 1
  ComponentElement.prototype.init = function() {
    comp.createBefore()
    const vTree = createVnode(comp)
    const dom = create(vTree)
    
    comp.$cacheState.dom = dom
    comp.$cacheState.vTree = vTree
    
    // 执行自定义指令的回调
    comp.$executeDirect(dom)
    comp.create(dom)
    return dom
  }

  ComponentElement.prototype.update = function(previous, domNode) {
    console.log(previous, domNode);
  }

  ComponentElement.prototype.destroy = function(dom) {
    comp.destroy(dom)
  }

  return new ComponentElement
}