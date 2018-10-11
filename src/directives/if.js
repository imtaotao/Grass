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
  `, 'if', vnodeConf.tagName, component)

  if (!res) {
    removeChild(vnodeConf.parent, vnodeConf)
  }

  return res
}