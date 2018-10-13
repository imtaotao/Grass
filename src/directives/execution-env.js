import scope from './scope'
import * as _ from '../utils/index'

export default function runExecuteContext (runCode, directName, tagName, component, callback) {
  const { noStateComp, state, props } = component
  const insertScope = noStateComp ? props : state
  const realData = scope.insertChain(insertScope || {})

  if (directName !== '{{ }}') {
    directName = 'v-' + directName
  }

  return run(runCode, directName, tagName, component, callback, realData)
}

function run (runCode, directName, tagName, component, callback, state) {
  try {
    const fun = new Function('$obj_', '$callback_', runCode)
    return fun.call(component, state, callback)
  } catch (error) {
    _.warn(`Component directive compilation error  \n\n  "${directName}":  ${error}\n\n
    --->  ${component.name}: <${tagName || ''}/>\n`)
  }
}