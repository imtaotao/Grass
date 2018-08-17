import * as _ from '../utils/index'
import { _h } from './overrides'
import { TAG } from '../ast/parse-template'
import { createCompInstance } from './create-instance'
import complierAst from '../directives/index'
import createCompVnode from './create-comp-vnode'

export default function createVnode (parentConf, ast, comp) {
  const vnodeConf = complierAst(ast, comp)

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

function createCustomComp (parentConf, comp) {
  const childComp = getChildComp(comp, parentConf.tagName)
  if (typeof childComp !== 'function') {
    _.warn(`Component [${conf.tagName}] is not registered  \n\n  --->  ${comp.name}\n`)
    return
  }

  const childCompInstance = createCompInstance(childComp, parentConf, comp)
  return createCompVnode(parentConf, childCompInstance)
}

// 拿到子组件
function getChildComp (parentComp, tagName) {
  if (!parentComp.component) return null

  let childComps = parentComp.component

  if (typeof childComps === 'function') {
    childComps = childComps()
  }
  if (_.isPlainObject(childComps)) {
    return childComps[tagName]
  }

  if (Array.isArray(childComps)) {
    for (let i = 0; i < childComps.length; i++) {
      if (tagName === childComps[i].name) {
        return childComps[i]
      }
    }
  }

  return null
}