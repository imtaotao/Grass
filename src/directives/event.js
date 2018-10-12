import * as _ from '../utils/index'
import runExecuteContext from './execution-env'
import { splitDirective } from './weight'

export default function vevent (events, component, vnodeConf) {
  if (_.isReservedTag(vnodeConf.tagName)) {
    for (const event of events) {
      const direactiveKey = event.attrName
      const { directive:name, modifiers } = splitDirective(direactiveKey)
      
      const code = `
        with ($obj_) {
          return ${event.value};
        }
      `
      const cb = runExecuteContext(code, 'on', vnodeConf.tagName, component)

      if (modifiers.length) {
        vnodeConf.attrs['on' + name] = createModifiersFun(modifiers, cb)
      } else {
        vnodeConf.attrs['on' + name] = cb
      }
    }
  }
}

function createModifiersFun (modifiers, cb) {
  return function (e) {
    let haveSelf
    const isSelf = e.target === e.currentTarget

    for (let i = 0, len = modifiers.length; i < len; i++) {
      const val = modifiers[i]
      val === 'self' && (haveSelf = true)

      haveSelf
        ? isSelf && dealWithModifier(val)
        : dealWithModifier(val)
    }

    haveSelf
      ? isSelf && cb.call(this, e)
      : cb.call(this, e)

    function dealWithModifier (val) {
      switch (val) {
        case 'prevent' :
          e.preventDefault()
          break
        case 'stop' :
          e.stopPropagation()
          break
      }
    }
  }
}