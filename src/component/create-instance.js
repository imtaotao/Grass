import * as _ from '../utils/index'
import { parseTemplate } from '../ast/parse-template'

// 创建一个组件实例，分为状态组件和无状态组件
export function createCompInstance (comConstructor, parentConf, parentComp) {
  const isClass = _.isClass(comConstructor)
  let comp

  if (isClass) {
    comp = new comConstructor(parentConf.attrs)
  } else {
    // 创建无状态组件
    const props = _.setProps(parentConf.attrs)
    const template = comConstructor(props)
    comp = {
      constructor: comConstructor,
      name: comConstructor.name,
      noStateComp: !isClass,
      template,
      props,
    }
  }

  // 避免组件自己引用自己
  if (isClass && comp.prototype === Object.getPrototypeOf(parentComp)) {
    _.warn(`Component can not refer to themselves  \n\n  --->  ${parentComp.name}\n`)
    return
  }

  // 我们把 ast 缓存到类的构造函数上
  if (!comConstructor.$ast) {
    const { template, name } = comp
    comConstructor.$ast = createAst(template, name)
  }

  return comp
}

export function createAst (template, compName) {
  let ast
  if (typeof template === 'function') {
    template = template()
  }

  if (!_.isString(template)) {
    _.warn(`Component template must a "string" or "function", But now is "${typeof template}"
      \n\n  --->  ${compName}\n`)
    return
  }
  if (!(ast = parseTemplate(template.trim(), compName))) {
    _.warn(`No string template available  \n\n  --->  ${compName}`)
    return
  }

  return ast
}