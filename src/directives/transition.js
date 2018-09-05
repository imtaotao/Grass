import * as _ from '../utils/index'
import runExecuteContext from './execution-env'

export default function transition (val, comp, vnodeConf, transtionHookFuns, isTransition) {
  const directName = isTransition ? 'transtion' : 'animation'
  const transitonName = runExecuteContext ('return ' + val, directName, vnodeConf.tagName, comp)
  const hookFuns = {}

  for (let key in transtionHookFuns) {
    const fun = runExecuteContext ('return ' + transtionHookFuns[key], directName, vnodeConf.tagName, comp)

    hookFuns[key] = fun
  }

  vnodeConf.vTransitionType = directName

  vnodeConf.vTransitionData = {
    name: transitonName,
    hookFuns,
  }
}