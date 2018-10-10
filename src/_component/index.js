import * as _ from '../utils/index'
import { WidgetVNode } from './component-vnode'
import { create } from '../virtual-dom/index'
import { enqueueSetState } from './setState'
import { Promise } from 'core-js';

export class Component {
  constructor (attrs, requireList) {
    this.name = this.constructor.name
    this.state = Object.create(null)
    this.props = _.getProps(attrs, requireList, this.name)
    this.$parentConfig = null
    this.$cacheState  = {
      stateQueue: [],
    }
  }


  createBefore () {}
  create (dom) {}
  willUpdate (dom) {}
  willReceiveProps (newProps) {}
  didUpdate (dom) {}
  destroy (dom) {}

  setState (partialState) {
    enqueueSetState(this, partialState)
  }

  createState (data) {
    if (_.isPlainObject(data)) {
      this.state = Object.setPrototypeOf(data, null)
    }
  }
}

export function mount (rootDOM, componentClass) {
  return new Promise(resolve => {
    const vnode = new WidgetVNode({}, componentClass)
    const dom = create(vnode)

    rootDOM.appendChild(dom)
    resolve(dom)
  })
}