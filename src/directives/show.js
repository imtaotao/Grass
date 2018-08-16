import bind from './bind'
import runExecuteContext from './execution-env'
import * as _ from '../utils/index'

export default function show (val, comp, vnodeConf) {
  const code = `with($obj_) { return !!(${val}); }`

  const value = runExecuteContext(code, 'show', vnodeConf.tagName, comp)
    ? ''
    : 'display: none'

  const bindValue = { attrName: 'style', value }

  if (_.isReservedTag(vnodeConf.tagName)) {
    bind(bindValue, comp, vnodeConf)
    return
  }

  vnodeConf.vShowResult = bindValue
}