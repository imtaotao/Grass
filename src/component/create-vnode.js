import * as _ from '../utils'
import { _h } from './overrides'
import { TAG } from '../ast/parse-template'
import { parseTemplate } from '../ast/parse-template'
import complierAst from '../directives'
import createCompVnode from './create-comp-vnode'

export default function createVnode (parentConf, comp) {
  const vnodeConf = complierAst(comp.constructor.$ast, comp)

  _.migrateCompStatus(parentConf, vnodeConf)

  return _h(vnodeConf.tagName, vnodeConf.attrs,
    vnodeConf.customDirection, generatorChildren(vnodeConf.children, comp))
}

function generatorChildren (children, comp) {
  const vnodeTree = []

  for (let i = 0; i < children.length; i++) {
    if (!children[i]) continue
    const conf = children[i]
    if (conf.type === TAG) {
      if (!_.isReservedTag(conf.tagName)) {
        // 自定义组件
        vnodeTree.push(createCustomComp(conf, comp))
        continue
      }

      // 递归创建 vnode
      const _children = generatorChildren(conf.children, comp)
      vnodeTree.push(_h(conf.tagName, conf.attrs, conf.customDirection, _children))
      continue
    }

    // 文本节点直接添加文件就好了，过滤掉换行空格
    const content = _.toString(conf.content)
    if (content.trim()) {
      vnodeTree.push(content)
    }
  }

  return vnodeTree
}

function createCustomComp (conf, comp) {
  const childComp = getChildComp(comp, conf.tagName)
  if (!childComp) {
    _.warn(`Component [${conf.tagName}] is not registered  \n\n  --->  ${comp.name}\n`)
    return
  }

  const childCompInstance = createCompInstance(childComp, conf, comp)
  return createCompVnode(conf, childCompInstance)
}

export function createCompInstance (comConstructor, parentConf, parentComp) {
  const comp = new comConstructor(parentConf.attrs)
  // 避免组件自己引用自己
  if (comp.prototype === Object.getPrototypeOf(parentComp)) {
    _.warn(`Component can not refer to themselves  \n\n  --->  ${parentComp.name}\n`)
    return
  }
  if (!comp.constructor.$ast) {
    comp.constructor.$ast = createAst(comp)
  }

  return comp
}

function getChildComp (parentComp, tagName) {
  if (!parentComp.component) return null

  let childComps = parentComp.component
  if (typeof childComps === 'function') {
    childComps = childComps()
  }
  if (_.isPlainObject(childComps))
    return childComps[tagName]

  if (Array.isArray(childComps)) {
    for (let i = 0; i < childComps.length; i++) {
      if (tagName === childComps[i].name) {
        return childComps[i]
      }
    }
  }

  return null
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
    _.warn(`No string template available  \n\n  --->  ${comp.name}`)
    return
  }

  return ast
}