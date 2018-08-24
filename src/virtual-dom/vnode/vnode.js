import version from './version'
import { isVNode, isWidget } from './typeof-vnode'

const noProperties = {}
const noChildren = []

export default function VirtualNode (tagName, properties, children, key, namespace) {
  this.tagName = tagName
  this.properties = properties || noProperties
  this.children = children || noChildren

  this.key = !isUndef(key)
    ? String(key)
    : undefined

  this.namespace = (typeof namespace === 'string')
    ? namespace
    : null

  let count = (children && children.length) || 0
  let descendants = 0
  let hasWidgets = false

  // 记录 hasWidgets 属性
  for (let i = 0; i < count; i++) {
    const child = children[i]

    if (isVNode(child)) {
      descendants += child.count || 0

      if (!hasWidgets && child.hasWidgets) {
        hasWidgets = true
      }
    } else if (!hasWidgets && isWidget(child)) {
      // 我们要记录下当前这个 vnode 是否包含了 widget 节点，因为我们在 diff 的时候用得着
      if (typeof child.destroy === 'function') {
        hasWidgets = true
      }
    }
  }

  this.count = count + descendants
  this.hasWidgets = hasWidgets
}

function isUndef (v) {
  return v === undefined || v === null
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"