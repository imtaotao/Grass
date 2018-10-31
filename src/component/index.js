import * as _ from '../utils/index'
import { create } from '../virtual-dom/index'
import { initWatchState } from '../observer'
import { WidgetVNode } from './component-vnode'
import { set, del } from '../observer/additional'
import { enqueueSetState, updateDomTree } from './update-state'


export class Component {
  constructor (attrs, requireList) {
    this.name = this.constructor.name
    this.state = Object.create(null)
    this.props = getProps(attrs, requireList, this.name)
    this.$el = null
    this.$slot = null
    this.$parent = null
    this.$children = {}
    this.$isWatch = false
    this.$firstCompilation = true
    this.$propsRequireList = requireList
    this.$data = {
      stateQueue: [],
    }
  }


  createBefore () {}
  created (dom) {}
  willUpdate (dom) {}
  willReceiveProps (newProps) {}
  didUpdate (dom) {}
  destroy (dom) {}

  setState (partialState) {
    if (this.$isWatch) {
      _.grassWarn("Current response data pattern, you can't use setState method.", this.name)
      return
    }
    enqueueSetState(this, partialState)
  }

  forceUpdate () {
    forceUpdate(this)
  }

  // Get child component class.
  getComponent (name) {
    let component = this.component

    if (component) {
      if (typeof component === 'function') {
        this.component = component = component.call(this)
      }
  
      const res = component[name]

      if (res) {
        if (res.async === true) {
          const factory = res.factory
          if (!factory.loading && !factory.error) {
            return factory.resolved || null
          }
        } else {
          return res
        }
      }
    }
    return null
  }

  createState (data) {
    data = Object.setPrototypeOf(data, null)

    if (_.isPlainObject(data)) {
      this.state = data
      this.$isWatch = false
    }
  }

  createResponseState (data) {
    data = Object.setPrototypeOf(data, null)

    if (_.isPlainObject(data)) {
      initWatchState(data)
      this.state = data
      this.$isWatch = true
    }
  }

  static
  mount (rootDOM) {
    return mount(rootDOM, this)
  }
}

Component.prototype.set = set
Component.prototype.delete = del

export function mount (rootDOM, componentClass) {
  const vnode = new WidgetVNode(null, {}, null, componentClass)
  const dom = create(vnode)

  rootDOM && rootDOM.appendChild(dom)

  return vnode.component
}

// 如果定义了需要的 props 列表，我们就按照列表的来
// 而且我们需要过滤掉内部用到的属性，例如 "key"
const filterPropsList = {
  'key': 1,
  'slot': 1,
  'styleName': 1,
  'className': 1,
}

export function getProps (attrs, requireList, name) {
  const props = Object.create(null)
  if (!attrs) {
    return props
  }

  const keys = Object.keys(attrs)
  let index = null

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (filterPropsList[key]) {
      continue
    }

    const val = attrs[key]

    if (!requireList) {
      props[key] = val
    } else if (requireList && ~(index = requireList.indexOf(key))) {
      props[key] = val
      requireList.splice(index, 1)
    }
  }

  if (requireList && requireList.length) {
    const attrs = requireList.join('", "')
    _.warn(
      `Parent component does not pass "${attrs}" attributes  \n\n    --->  ${name}\n`,
      true,
    )
  }

  return props
}

export function forceUpdate (component) {
  const stateQueue = component.$data.stateQueue

  if (!stateQueue.length) {
    Promise.resolve().then(() => {
      updateDomTree(component)
      stateQueue.length = 0
    })
  }

  stateQueue.push(null)
}