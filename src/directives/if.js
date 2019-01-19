import * as _ from '../utils/index'
import { removeChild } from './util'
import runExecuteContext from './execution-env'

export default function vif (node, val, component, vnodeConf) {
  if (!node.parent) {
    return _.sendDirectWarn('v-if', component.name)
  }

  const res = runExecuteContext(`
    with($obj_) {
      return !!(${val});
    }
  `, 'if', vnodeConf, component)

  if (!res) {
    removeChild(vnodeConf.parent, vnodeConf)
    removeChildrenInstance(component, vnodeConf)
  }
  return res
}

// remove component $children ref
function removeChildrenInstance (component, vnodeConf) {
  const ref = vnodeConf.attrs.ref
  if (_.isUndef(ref) ||
      _.isHTMLTag(vnodeConf.tagName) ||
      _.isInternelTag(vnodeConf.tagName)
  ) return

  const children = component.$children
  if (children[ref]) {
    children[ref] = null
  }
}