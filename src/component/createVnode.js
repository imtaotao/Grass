import * as _ from '../utils'
import { h } from 'virtual-dom'
import { TAG } from '../ast/parse_template'
// import optimize from '../ast/static_optimize'
import { parseTemplate } from '../ast/parse_template'
import complierAst from '../directives'
import createElement from './overrides'

export default function createVnode (comp) {
  const vnodeConf = complierAst(comp.constructor.$ast, comp)

  // console.log(vnodeConf);
  return h(vnodeConf.tagName,
    vnodeConf.attrs, generatorChildren(vnodeConf.children, comp))
}

function generatorChildren (children, comp) {
  const vnodeTree = []
  
  for (let i = 0; i < children.length; i++) {
    const conf = children[i]

    if (conf.type === TAG) {
      if (!_.isReservedTag(conf.tagName)) {
        
        // 自定义组件
        vnodeTree.push(createConstomComp(conf, comp))
        continue
      }

      // 递归创建 vnode
      vnodeTree.push(h(
        conf.tagName,
        conf.attrs,
        generatorChildren(conf.children, comp)
      ))

      continue
    }

    // 文本节点直接添加文件就好了，过滤掉换行空格
    if (conf.content.trim()) {
      vnodeTree.push(conf.content)
    }
  }

  return vnodeTree
}

export function createAst (comp) {
  let template = comp.template
  const error = text => {
    return `Component template ${text}, But now is "${typeof template}"  \n\n  --->  ${comp.name}\n`
  }
  
  if (!_.isString(template) && !_.isFunction(template)) {
    _.warn(error('must a "string" or "function"'))
    return
  }

  if (typeof template === 'function') {
    template = template()
    if (!_.isString(template)) {
      _.warn(error('function must return "string"'))
      return
    }
  }

  const ast = parseTemplate(template.trim(), comp.name)
  if (!ast) {
    _.warn('xxx error')
  }
  // optimize(ast)
  return ast
}

function createConstomComp (conf, comp) {
  let res
  let childComps = comp.component
  const errorInfor = `Component [${conf.tagName}] is not registered  \n\n  --->  ${conf.name}\n`
  
  if (!childComps) {
    _.warn(errorInfor)
    return
  }

  if (typeof childComps === 'function') {
    childComps = childComps()
  }
  
  if (_.isPlainObject(childComps)) {
    res = childComps[conf.tagName]
  }

  if (Array.isArray(childComps)) {
    for (let i = 0; i < childComps.length; i++) {
      if (conf.tagName === childComps[i].name) {
        res = childComps[i]
        break
      }
    }
  }

  if (!res) {
    _.warn(errorInfor)
    return
  }
 
  const childComp = new res(conf.attrs)

  // 避免组件自己引用自己
  if (res.prototype === Object.getPrototypeOf(comp)) {
    _.warn(`Component can not refer to themselves  \n\n  --->  ${comp.name}\n`)
    return
  }
  
  if (!childComp.constructor.$ast) {
    childComp.constructor.$ast = createAst(childComp)
  }

  return createSingleCompVnode(conf, childComp)
}

function createSingleCompVnode (parentConf, comp) {
  function ComponentElement () {}

  ComponentElement.prototype.type = 'Widget'
  // 我们只有一个子节点，就当前组件
  ComponentElement.prototype.count = 1
  ComponentElement.prototype.init = function() {
    console.log(comp.name);
    let vTree
    if (vTree = createVnode(comp)) {
      // console.log(parentConf, vTree);
      comp.createBefore()
      const dom = createElement(vTree)
      
      comp.$cacheState.dom = dom
      comp.$cacheState.vTree = vTree
      
      comp.create(dom)
      return dom
    }
    return null
  }

  ComponentElement.prototype.update = function(previous, domNode) {
    console.log(previous, domNode);
  }

  ComponentElement.prototype.destroy = function(dom) {
    comp.destroy(dom)
  }

  return new ComponentElement
}

function getNomalAst (vnodeConf) {
  // 如果组件的内容只有一个节点我们就用这个节点，否则我们就用一个 div 给包裹起来
}

export function isLegalComp (node, compName) {
  let componentNumber = 0
  const children = node.children || node
  for (const child of children) {
    if (!isTag(child)) {
      _.warn(`Child elements of template must be unique tags  \n\n  --->  ${compName}\n`)
    }

    if (++componentNumber > 1) {
      _.warn(`Template component can only have one child element  \n\n  --->  ${compName}\n`)
      return 
    }
  }

  function isTag (child) {
    return child.type === TAG
      ? true
      : !child.content.trim()
  }
}