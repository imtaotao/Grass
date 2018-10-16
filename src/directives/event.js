import * as _ from '../utils/index'
import runExecuteContext from './execution-env'
import { splitDireation } from './weight'

export default function vevent (events, component, vnodeConf) {
  if (_.isReservedTag(vnodeConf.tagName)) {
    for (const event of events) {
      const direactiveKey = event.attrName
      const { direation:name, modifiers } = splitDireation(direactiveKey)

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
  function eventCallback (e) {
    let haveSelf
    const isSelf = e.target === e.currentTarget

    for (let i = 0, len = modifiers.length; i < len; i++) {
      const val = modifiers[i]
      val === 'self' && (haveSelf = true)

      // Modifier order is important
      haveSelf
        ? isSelf && dealWithModifier(val)
        : dealWithModifier(val)
    }

    haveSelf
      ? isSelf && cb.call(this, e)
      : cb.call(this, e)

    function dealWithModifier (val) {
      /**
       * We can't achieve 'once' modifier, because, we need allow user use custom 'bind' function,
       * this function return a new function, resulting in we can't get same value.
       * Maybe we can help user bind 'bind' function
       **/
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

  return eventCallback
}