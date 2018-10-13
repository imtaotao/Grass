import * as _ from '../utils/index'
import { WidgetVNode } from './component-vnode'
import { create } from '../virtual-dom/index'
import { enqueueSetState } from './update-state'

export class Component {
  constructor (attrs, requireList) {
    this.name = this.constructor.name
    this.state = Object.create(null)
    this.propsRequireList = requireList
    this.props = getProps(attrs, requireList, this.name)
    this.$slot = null
    this.$data = {
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
    const vnode = new WidgetVNode({}, null, componentClass)
    const dom = create(vnode)

    rootDOM.appendChild(dom)
    resolve(dom)
  })
}

// 如果定义了需要的 props 列表，我们就按照列表得到来
// 而且我们需要过滤掉内部用到的属性，例如 "key"
const filterPropsList = {
  'key': 1,
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