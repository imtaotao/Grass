import * as _ from '../utils'
import runExecuteContext from './execution_env'

export default function vif (node, val, comp, vnodeConf) {
  if (!node.parent)
    return  _.sendDirectWarn('v-if', comp.name)

  const res = runExecuteContext(`with($obj_) { return !!(${val}); }`, comp)
  if (!res) {
    _.removeChild(vnodeConf.parent, vnodeConf)
  }

  return res
}