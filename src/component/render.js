import * as _ from '../utils/index'
import complierAst from '../directives/index'
import createCompVnode from './widget-vnode'
import { _h } from './overrides'
import { TAG } from '../ast/parse-template'
import { addCache, getCache } from './cache'
import { createCompInstance, setCompId } from './instance'

export default function render (parentConf, ast, comp) {
  const vnodeConf = complierAst(ast, comp)
  const walk = {
    name: comp.$id,
    index: 0,
  }

  _.migrateCompStatus(parentConf, vnodeConf)

  if (typeof comp.constructor.CSSModules === 'function') {
    comp.constructor.CSSModules(vnodeConf, comp.name)
  }

  return _h(vnodeConf, 
    generatorChildren(vnodeConf.children, comp, walk), getId(walk))
}

function generatorChildren (children, comp, walk) {
  const vnodeTree = []
  for (let i = 0; i < children.length; i++) {
    walk.index++
    if (!children[i]) {
      continue
    }

    const conf = children[i]
    if (conf.type === TAG) {
      if (!_.isReservedTag(conf.tagName)) {
        // 自定义组件
        vnodeTree.push(createCustomComp(conf, comp, i, walk))
        continue
      }

      // 递归创建 vnode
      vnodeTree.push(_h(conf, 
        generatorChildren(conf.children, comp, walk), getId(walk)))
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

function createCustomComp (parentConf, comp, i) {
  const cacheInstance = getCache(comp, parentConf.tagName, i)
  const tagName = parentConf.tagName

  if (cacheInstance) {
    // 如果有缓存的组件，我们就使用缓存
    // 同时需要改变对子组件的 props 以及 指令，进行重新 diff
    cacheInstance.$parentConf = parentConf
    return createCompVnode(parentConf, comp, cacheInstance)
  }

  const childComp = getChildComp(comp, tagName)

  if (typeof childComp !== 'function') {
    _.grassWarn(`Component [${tagName}] is not registered`, comp.name)
    return
  }

  const childCompInstance = createCompInstance(childComp, parentConf, comp)
  
  setCompId(comp, childCompInstance, i)
  addCache(comp, tagName, childCompInstance, i)

  return createCompVnode(parentConf, comp, childCompInstance)
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

  return null
}

function getId (walk) {
  return walk.name + '_' + walk.index
}