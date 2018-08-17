import * as _ from '../utils/index'
import { diff, patch } from 'virtual-dom'
import { createRealDom } from './create-comp-vnode'
import createVnode from './create-vnode'
import { createCompInstance } from './create-instance'

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
        const ast = this.constructor.$ast
        const dom = this.$cacheState.dom
        const oldTree = this.$cacheState.vTree
        const newTree = createVnode(null, ast, this)
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
  return new Promise((resolve) => {
    const comp = createCompInstance(compClass, {}, {})
    const dom = createRealDom(null, comp)

    rootDOM.appendChild(dom)
    resolve(dom)
  })
}