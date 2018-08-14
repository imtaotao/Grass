import bind from './bind'
import runExecuteContext from './execution-env'
import * as _ from '../utils'

export default function show (val, comp, vnodeConf) {
  const code = `with($obj_) { return !!(${val}); }`
  const value = runExecuteContext(code, comp)
    ? ''
    : 'display: none'
  const bindValue = { attrName: 'style', value }

  if (_.isReservedTag(vnodeConf)) {
    bind(bindValue, comp, vnodeConf)
    return
  }

  vnodeConf.vShowResult = bindValue
}