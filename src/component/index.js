import * as _ from '../utils'
import createVnode from './createVnode'
import createElement from './overrides'
import { diff, patch } from 'virtual-dom'

import { createAst } from './createVnode'

export default class Component {
  constructor (attrs, requireList) {
    if (attrs && !_.isPlainObject(attrs)) {
      _.warn(`Component "props" must be an object(inset error 😁). \n\n ---> ${this.name}`)
      return
    }
    this.state = {}
    this.props = _.setProps(attrs || {}, requireList, this.name)
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
        if (this.willUpdate(this.state) === false) {
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
}

function mountComponent (rootDOM, comp) {
  return new Promise(resolve => {
    comp.createBefore()
    const vTree = createVnode(comp)

    if (!vTree) return
    const dom = createElement(vTree)
    
    comp.$cacheState.dom = dom
    comp.$cacheState.vTree = vTree
    rootDOM.appendChild(dom)

    comp.create(dom)
    resolve(dom)
  })
}