import * as _ from '../utils'
import { TAG, TEXT } from '../ast/parse-template'

export function createVnodeConf (astNode, parent) {
  if (astNode.type === TAG) {
    const { tagName, attrs, indexKey, direction } = astNode
    const _children = []
    const _attrs = _.deepClone(attrs)
    const _direction = _.deepClone(direction)

    const tag = vTag(tagName, parent, _attrs, indexKey, _direction, _children)

    if (_.hasOwn(astNode, 'for')) {
      // 此处不用深拷贝
      tag.for = true
      tag.watcherCollectList = astNode.watcherCollectList
    }

    return tag
  }

  return vText(astNode.content, parent)
}

export function vTag (tagName, parent, attrs, indexKey, direction, children) {
  const node = Object.create(null)

  node.type = TAG
  node.attrs = attrs
  node.parent = parent
  node.tagName = tagName
  node.indexKey = indexKey
  node.children = children
  node.direction = direction

  return node
}

export function vText (content, parent) {
  const node = Object.create(null)

  node.type = TEXT
  node.parent = parent
  node.content = content

  return node
}

export function removeChild (parent, child) {
  const children = parent.children
  for (let i = 0; i < children.length; i++) {
    if (children[i] === child) {
      // 我们设置为 null 而不直接删掉是为了保证我们的 tag 顺序不变
      children[i] = null
    }
  }
}