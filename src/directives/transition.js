import * as _ from '../utils/index'
import runExecuteContext from './execution-env'

export default function transition (val, component, vnodeConf, transtionHookFuns, isTransition) {
  const directName = isTransition ? 'transtion' : 'animation'
  const transitonName = runExecuteContext ('return ' + val, directName, vnodeConf.tagName, component)
  const hookFuns = {}

  for (let key in transtionHookFuns) {
    const fun = runExecuteContext ('return ' + transtionHookFuns[key], directName, vnodeConf.tagName, component)

    hookFuns[key] = fun
  }

  vnodeConf.vTransitionType = directName

  vnodeConf.vTransitionData = {
    name: transitonName,
    hookFuns,
  }
}