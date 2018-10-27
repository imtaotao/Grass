import * as _ from '../utils'
import { getProps } from './index'
import { enqueueSetState } from './update-state'
import { parseTemplate } from '../ast/parse-template'

export function getComponentInstance (widgetVNode, parentComponent) {
  const { componentClass, data } = widgetVNode
  const isClass = _.isClass(componentClass)
  let instance

  if (isClass) {
    instance = new componentClass(data.parentConfig.attrs)

    if (typeof instance.state === 'function') {
      const res = instance.state()
      _.isPlainObject(res)
        ? instance.state = res
        : _.grassWarn('Component "state" must be a "Object"', instance.name)
    }
  } else {
    const props = getProps(data.parentConfig.attrs)
    const template = componentClass(props, parentComponent)
    
    instance = createNoStateComponent(props, template, componentClass)
  }

  // We saved ast in component constructor
  if (!componentClass.$ast) {
    componentClass.$ast = genAstCode(instance)
  }

  if (parentComponent) {
    instance.$parent = parentComponent
  }

  return instance
}

function createNoStateComponent (props, template, componentClass) {
  return {
    props,
    template,
    noStateComp: true,
    name: componentClass.name,
    constructor: componentClass,
    $el: null,
    $slot: null,
    $parent: null,
    $firstCompilation: true,
    $data: {
      stateQueue: []
    },
    setState (partialState) {
      enqueueSetState(this, partialState)
    }
  }
}

function genAstCode (component) {
  let { template, name } = component
  let ast

  // 'template' attribute maybe a function
  if (typeof template === 'function') {
    template = template.call(component)
  }

  if (typeof template !== 'string') {
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