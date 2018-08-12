import * as _ from '../utils'
import runExecuteContext from './execution_env'

export default function vif (node, val, comp) {
  if (!node.parent) {
    _.sendDirectWarn('v-if', comp.name)
    return
  }
  const code = `
    with($obj_) {
      return !!(${val});
    }
  `
  return runExecuteContext(code, comp)
}