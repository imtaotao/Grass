import runExecuteContext from './execution_env'
import * as _ from '../utils'

export default function text (val, comp, vnodeConf) {
  const code = `with($obj_) { return ${val}; }`
  const content = runExecuteContext(code, comp)

  if (_.isReservedTag(vnodeConf.tagName)) {
    // 此时的 children 还只是个 []， 所以我们把 text 放在第一个
    vnodeConf.children = [_.vText(content, vnodeConf)]
  } else {
    vnodeConf.vTextResult = content
  }
}