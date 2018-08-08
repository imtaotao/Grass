import * as _ from '../utils'

class vnode {
  constructor (tagName, props = {}, children = [], order = {}) {
    if (!tagName) { return }
    this.tagName = tagName
    if (Array.isArray(props)) {
      order = children
      children = props
      props = null
    }
    this.setParam(tagName, props, children, order)
  }

  setParam (tagName, props, children) {
    this.props = props || {}
    this.key = props ? props.key : undefined
    this.children = children || []

    let count = 0
    _.each(this.children, (child, i) => {
      child instanceof vnode
        ? count += child.count
        : String(children[i])

      count++
    })
    this.count = count
  }

  render () {
    const {tagName, props, children} = this
    const element = document.createElement(tagName)

    // set element prop
    _.each(props, (prop, key) => {
      if (key === 'event') {
        _.each(prop, (fun, name) => element['on' + name] = fun)
        return
      }
      _.setAttr(element, key, prop)
    })

    // create child element
    _.each(children, (child, i) => {
      // judge child
      const childElement = (child instanceof vnode)
        ? child.render()
        : document.createTextNode(child)

      element.appendChild(childElement)
    })

    return element
  }
}

export function vnode (tagName, props, children) {
  return new vnode(tagName, props, children)
}