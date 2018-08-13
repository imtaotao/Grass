import * as _ from '../utils'
import { h } from 'virtual-dom'
import { TAG } from '../ast/parse_template'
// import optimize from '../ast/static_optimize'
import { parseTemplate } from '../ast/parse_template'
import complierAst from '../directives'
import createElement from './overrides'

export default function createVnode (comp) {
  const vnodeConf = complierAst(comp.constructor.$ast, comp)

  // 我们这里其实需要迁移父子组件之间的数据
  //  xxx

  return h(vnodeConf.tagName,
    vnodeConf.attrs, generatorChildren(vnodeConf.children, comp))
}

function generatorChildren (children, comp) {
  const vnodeTree = []

  for (let i = 0; i < children.length; i++) {
    if (!children[i]) continue
    const conf = children[i]
    if (conf.type === TAG) {
      if (!_.isReservedTag(conf)) {
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
    if (String(conf.content).trim()) {
      vnodeTree.push(conf.content)
    }
  }

  return vnodeTree
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

  // 我们构建的这个组件节点现在并没有一个子元素，否则会在 patch 的时候计算错误
  ComponentElement.prototype.count = 0

  ComponentElement.prototype.init = function() {
    let vTree = createVnode(comp)
    comp.createBefore()
    const dom = createElement(vTree)

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

  return new ComponentElement
}

export function createAst (comp) {
  let template = comp.template
  let ast
  if (typeof template === 'function')
    template = template()

  if (!_.isString(template)) {
    _.warn(error(`Component template must a "string" or "function", But now is "${typeof template}"
      \n\n  --->  ${comp.name}\n`))
    return
  }

  if (!(ast = parseTemplate(template.trim(), comp.name))) {
    _.warn('xxx error')
  }

  return ast
}