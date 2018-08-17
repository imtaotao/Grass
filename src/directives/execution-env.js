import scope from './scope'
import * as _ from '../utils/index'

export default function runExecuteContext (runCode, directName, tagName, comp, callback) {
  const insertScope = comp.noStateComp
      ? comp.props
      : comp.state

  const state = scope.insertChain(insertScope || {})

  if (directName !== '{{ }}') {
    directName = 'v-' + directName
  }

  return run(runCode, directName, tagName, comp, callback, state)
}

function run (runCode, directName, tagName, comp, callback, state) {
  try {
    const fun = new Function('$obj_', '$callback_', '$scope_', runCode)
    return fun.call(comp, state, callback, scope)

  } catch (error) {
    _.warn(`Component directive compilation error  \n\n  "${directName}":  ${error}\n\n
    --->  ${comp.name}: <${tagName || ''}/>\n`)
  }
}