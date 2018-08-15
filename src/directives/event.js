import runExecuteContext from './execution-env'
import * as _ from '../utils/index'

export default function vevent (events, comp, vnodeConf) {
  if (_.isReservedTag(vnodeConf.tagName)) {
    for (const event of events) {
      const name = event.attrName
      const code = `
        with ($obj_) {
          return ${event.value};
        }
      `

      vnodeConf.attrs['on' + name] = runExecuteContext(code, 'on', vnodeConf.tagName, comp)
    }
  }
}