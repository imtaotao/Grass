import * as _ from '../utils'
import { getProps, forceUpdate } from './index'
import { enqueueSetState } from './update-state'
import { parseTemplate } from '../ast/parse-template'

export function getComponentInstance (widgetVNode, parentComponent) {
  const { componentClass, data } = widgetVNode
  const isClass = _.isClass(componentClass)
  const tagName = widgetVNode.data.parentConfig.tagName
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
    const components = Object.create(null)
    const props = getProps(data.parentConfig.attrs)
    instance = createNoStateComponent(props, null, components, componentClass)

    // rigister components to lessState component
    function registerComponent (name, comp) {
      if (typeof name === 'function') {
        comp = name
        name = comp.name
        if (!name) {
          _.grassWarn(`Component must have a name, you can pass the component name in the first parameter`, componentClass.name)
        }
      }
      components[name] = comp
      return registerComponent
    }

    instance.template = componentClass.call(instance, props, registerComponent, parentComponent)
  }

  if (tagName) {
    _.setOnlyReadAttr(instance, 'name', tagName)
  }

  if (!instance.noStateComp) {
    instance.beforeCreate()
  }
  
  // We saved ast in component constructor
  if (!componentClass.$ast) {
    componentClass.$ast = genAstCode(instance)
  }

  return instance
}

function createNoStateComponent (props, template, component, componentClass) {
  const comp = {
    props,
    template,
    component,
    noStateComp: true,
    name: componentClass.name,
    constructor: componentClass,
    $el: null,
    $slot: null,
    $parent: null,
    $children: {},
    $firstCompilation: true,
    $data: {
      stateQueue: [],
      created: false,
    },
    forceUpdate () {
      forceUpdate(this)
    },
    setState (partialState) {
      enqueueSetState(this, partialState)
    }
  }
  _.setOnlyReadAttr(comp, 'noStateComp', true)
  return comp
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