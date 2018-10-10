import * as _ from '../utils/index'
import { removeChild } from './util'
import runExecuteContext from './execution-env'

export default function vif (node, val, comp, vnodeConf) {
  if (!node.parent) {
    return _.sendDirectWarn('v-if', comp.name)
  }

  const res = runExecuteContext(`
    with($obj_) {
      return !!(${val});
    }
  `, 'if', vnodeConf.tagName, comp)

  if (!res) {
    removeChild(vnodeConf.parent, vnodeConf)
  }

  return res
}