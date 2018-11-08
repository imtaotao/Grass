import * as _ from '../utils/index'
import { splitDireation } from './weight'
import runExecuteContext from './execution-env'

export default function transition (direactiveKey, val, component, vnodeConf, transtionHookFuns) {
  const { direation, modifiers } = splitDireation(direactiveKey)
  const type = modifiers[0]
  const directName = type === 'animate'
    ? 'animation'
    : 'transition'

  const transitonName = runExecuteContext ('return ' + val, directName, vnodeConf, component)
  const hookFuns = {}

  for (let key in transtionHookFuns) {
    const fun = runExecuteContext ('return ' + transtionHookFuns[key], directName, vnodeConf, component)

    hookFuns[key] = fun
  }

  vnodeConf.vTransitionType = directName

  vnodeConf.vTransitionData = {
    name: transitonName,
    hookFuns,
  }
}