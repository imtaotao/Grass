import * as _ from '../utils/index'
import createElement from './overrides'
import { diff, patch } from 'virtual-dom'
import createVnode, { createCompInstance } from './create-vnode'

export class Component {
  constructor (attrs, requireList) {
    this.state = Object.create(null)
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
      newState = newState(this.state)
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

  createState (data) {
    if (_.isPlainObject(data)) {
      this.state = Object.setPrototypeOf(data, null)
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
    window.d = vTree.children
    const dom = createElement(comp, vTree)

    comp.$cacheState.dom = dom
    comp.$cacheState.vTree = vTree

    rootDOM.appendChild(dom)

    comp.create(dom)

    resolve(dom)
  })
}