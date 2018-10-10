import * as _ from '../utils'
import { enqueueSetState } from './setState'
import { parseTemplate } from '../ast/parse-template'

export function getComponentInstance (widgetVNode) {
  const { componentClass, data } = widgetVNode
  const isClass = _.isClass(componentClass)
  let instance

  if (isClass) {
    instance = new componentClass(data.parentConf.attrs)
  } else {
    const props = _.getProps(data.parentConf.attrs)
    const template = componentClass(props)

    instance = createNoStateComponent(props, template, componentClass)
  }

  // We saved ast in component constructor
  if (!componentClass.$ast) {
    componentClass.$ast = genAstCode(instance)
  }

  return instance
}

function createNoStateComponent (props, template, componentClass) {
  return {
    constructor: componentClass,
    name: componentClass.name,
    noStateComp: true,
    template,
    props,
    $cacheState: {},
    setState (partialState) {
      enqueueSetState(this, partialState)
    }
  }
}

function genAstCode (component) {
  const { template, name } = component
  let ast

  // 'template' attribute maybe a function
  if (typeof template === 'function') {
    template = template.call(component)
  }

  if (!_.isString(template)) {
    _.grassWarn(`Component template must a "string" or "function", But now is "${typeof template}"`, name)
    return
  }

  // The template must be a no empty string clump
  if (!(ast = parseTemplate(template.trim(), name))) {
    _.grassWarn('No string template available', name)
    return
  }

  return ast
}