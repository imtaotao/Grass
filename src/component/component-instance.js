import * as _ from '../utils/index'
import { enqueueSetState } from './setState'
import { parseTemplate } from '../ast/parse-template'

// 创建一个组件实例，分为状态组件和无状态组件
export function createCompInstance (comConstructor, parentConf, parentComp) {
  const isClass = _.isClass(comConstructor)
  let comp

  if (isClass) {
    comp = new comConstructor(parentConf.attrs)
  } else {
    // 创建无状态组件
    const props = _.getProps(parentConf.attrs)
    const template = comConstructor(props)

    comp = {
      constructor: comConstructor,
      name: comConstructor.name,
      noStateComp: !isClass,
      template,
      props,
      $cacheState: {
        stateQueue: [],
        childComponent: {},
        componentElement: null,
        dom: null,
        vTree: null,
      },
      setState (partialState) {
        enqueueSetState(this, partialState)
      }
    }
  }

  // 避免组件自己引用自己
  if (isClass && comp.prototype === Object.getPrototypeOf(parentComp)) {
    _.warn(`Component can not refer to themselves  \n\n  --->  ${parentComp.name}\n`)
    return
  }

  // 我们把 ast 缓存到类的构造函数上
  if (!comConstructor.$ast) {
    comConstructor.$ast = createAst(comp)
  }

  return comp
}

export function createAst (comp) {
  let ast
  let { template, name } = comp

  if (typeof template === 'function') {
    template = template.call(comp)
  }

  if (!_.isString(template)) {
    _.warn(`Component template must a "string" or "function", But now is "${typeof template}"
      \n\n  --->  ${name}\n`)
    return
  }

  if (!(ast = parseTemplate(template.trim(), name))) {
    _.warn(`No string template available  \n\n  --->  ${name}`)
    return
  }

  return ast
}