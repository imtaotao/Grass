import * as _ from '../utils'
import createElement from './overrides'
import { diff, patch } from 'virtual-dom'
import createVnode, { createCompInstance } from './create-vnode'

export class Component {
  constructor (attrs, requireList) {
    this.state = {}
    this.props = _.setProps(attrs, requireList, this.name)
    this.$cacheState  = {
      setStateFlag: true,
    }
  }

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
        if (this.willUpdate(this.state, this.props) === false) {
          return
        }

        const dom = this.$cacheState.dom
        const oldTree = this.$cacheState.vTree
        const newTree = createVnode(null, this)
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
}

export function mount (rootDOM, compClass) {
  return new Promise((resolve, reject) => {
    const comp = createCompInstance(compClass, {}, {})
    if (!(comp instanceof Component)) {
      reject('[Grass tip]: The second parameter must be a component')
      return
    }

    comp.createBefore()
    const vTree = createVnode(null, comp)
    const dom = createElement(comp, vTree)
    
    comp.$cacheState.dom = dom
    comp.$cacheState.vTree = vTree

    rootDOM.appendChild(dom)

    comp.create(dom)

    resolve(dom)
  })
}