import * as _ from '../utils'

export default function runExecuteContext (runCode, directName, tagName, comp, callback) {
  try {
    const fun = new Function('$obj_', '$callback_', runCode)
    return fun.call(comp, comp.state || {}, callback)
  } catch (error) {
    _.warn(`Component directive compilation error  \n\n  "v-${directName}":  ${error}\n\n
      --->  ${comp.name}: <${tagName || ''}/>\n`)
  }
}