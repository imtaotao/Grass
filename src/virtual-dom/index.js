import _h from './h'
import _diff from './vtree/diff'
import _patch from './vdom/patch'
import _vNode from './vnode/vnode'
import _vText from './vnode/vtext'
import _create from './vdom/create-element'

export const h = _h
export const diff = _diff
export const patch = _patch
export const vNode = _vNode
export const vText = _vText
export const create = _create

export default {
  h,
  diff,
  patch,
  vNode,
  vText,
  create,
}