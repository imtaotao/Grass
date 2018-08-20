import * as _ from '../utils/index'
import { createRealDom } from './create-comp-vnode'
import { createCompInstance } from './create-instance'
import { enqueueSetState } from './setState'

export class Component {
  constructor (attrs, requireList) {
    this.state = Object.create(null)
    this.props = _.getProps(attrs, requireList, this.name)
    this.$parentConf = null
    this.$cacheState  = {
      stateQueue: [],
      childComponent: {},
      componentElement: null,
      dom: null,
      vTree: null,
    }
  }

  createBefore () {}
  create () {}
  willUpdate () {}
  willReceiveProps () {}
  didUpdate () {}
  destroy () {}

  setState (partialState) {
    enqueueSetState(this, partialState)
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