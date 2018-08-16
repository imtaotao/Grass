import scope from './scope'
import * as _ from '../utils/index'

export default function runExecuteContext (runCode, directName, tagName, comp, callback) {
  try {
    const fun = new Function('$obj_', '$callback_', '$scope_', runCode)
    const state = scope.insertChain(comp.state)

    return fun.call(comp, state, callback, scope)
  } catch (error) {
    _.warn(`Component directive compilation error  \n\n  "v-${directName}":  ${error}\n\n
      --->  ${comp.name}: <${tagName || ''}/>\n`)
  }
}