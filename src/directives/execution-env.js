import scope from './scope'
import Watcher from '../observer/Watcher'
import * as _ from '../utils/index'

export default function runExecuteContext (code, directName, vnodeConf, component, callback) {
  const { noStateComp, state, props } = component
  const insertScope = noStateComp ? props : state
  const realData = scope.insertChain(insertScope || {})

  if (!/{{[\s\S]*}}/g.test(directName)) {
    directName = 'v-' + directName
  }

  const options = {
    code,
    callback,
    vnodeConf,
    component,
    directName,
    state: realData,
  }
  return run(options)
}

function run ({ code, state, vnodeConf, callback, component, directName }) {
  try {
    return getStateResult(code, vnodeConf, component, state, callback)
  } catch (error) {
    _.warn(`Component directive compilation error  \n\n  "${directName}":  ${error}\n\n
    --->  ${component.name || 'unknow'}: <${vnodeConf.tagName || 'unknow'}/>\n`)
  }
}

function getStateResult (code, vnodeConf, component, state, callback) {
  const fun = new Function('$obj_', '$callback_', code)

  if (component.$isWatch && component.$firstCompilation) {
    let value

    new Watcher(component, () => {
      value = fun.call(component, state, callback)
      return value
    }, component.forceUpdate)

    return value
  } else {
    return fun.call(component, state, callback)
  }
}