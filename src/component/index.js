import * as _ from '../utils'
import createVnode from './createVnode'
import optimize from '../ast/static_optimize'
import { parseTemplate } from '../ast/parse_template'
import { diff, patch, create } from 'virtual-dom'

export default class Component {
  constructor () {
    this.state = {}
    this.$cacheState  = {
      setStateFlag: true,
    }
  }
  
  $executeDirect () {}

  createBefore () {}
  create () {}
  willUpdate () {}
  didUpdate () {}
  destroy () {}

  setState (newState) {
    if (typeof newState === 'function') {
      newState = state(this.state)
    }

    this.state = Object.assign({}, this.state, newState)

		if (this.$cacheState.setStateFlag) {
      this.$cacheState.setStateFlag = false
			Promise.resolve().then(() => {
        if (willUpdate(this.state) === false) {
          return
        }

        const dom = this.$cacheState.dom
        const oldTree = this.$cacheState.vTree
        const newTree = createVnode(this)
        const patchs = diff(oldTree, newTree)

        patch(dom, patchs)
        
        this.didUpdate(dom)
        this.$cacheState.vTree = newTree
				this.$cacheState.setStateFlag = true
			})
		}
  }

  get name () {
    return this.constructor.name
  }

  static mount (rootDOM, compClass) {
    const comp = new compClass
    
    if (!(comp instanceof Component)) {
      _.warn('The second parameter must be a component')
      return
    }

    compClass.$ast = createAst(comp)
    return mountComponent(rootDOM, comp)
  }

  static didMount () {}
}


export function createAst (comp) {
  let template = comp.template
  const error = text => {
    return `Component template ${text}, But now is "${typeof template}"  \n\n  --->  [${comp.name}]\n`
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

  const ast = parseTemplate(template.trim())
  optimize(ast[0] || {})
  return ast
}

function mountComponent (rootDOM, comp) {
  return new Promise(resolve => {
    const vTree = createVnode(comp)
    const dom = create(vTree)
    
    comp.$cacheState.dom = dom
    comp.$cacheState.vTree = vTree
    rootDOM.appendChild(dom)

    resolve(dom)
  })
}