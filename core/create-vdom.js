import * as _ from './util'

class vnode {
  constructor (tagName, props = {}, children = []) {
    if (!tagName) { return }
    this.tagName  = tagName
    if (Array.isArray(props)) {
      children = props
      props = null
    }
    this.setParam(tagName, props, children)
  }

  setParam (tagName, props, children) {
    this.props    = props || {}
    this.key      = props ? props.key : undefined
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
      _.setAttr(element, key, prop)
    })

    // create child element
    _.each(children, (child, i) => {
      // judg child
      const childElement = (child instanceof vnode) 
        ? child.render()
        : document.createTextNode(child)

      element.appendChild(childElement)
    })

    return element
  }
}

export default function (tagName, props, children) {
  return new vnode(tagName, props, children)
}