import * as _ from '../utils'

export default function runExecutContext (runCode, comp, callback) {
  const fun = new Function('$obj_', '$callback_', runCode)

  return run(fun, comp, callback)
}

function run (fun, comp, callback) {
  try {
    return fun.call(comp, comp.state || {}, callback)
  } catch (error) {
    _.warn(`Component template compilation error  \n\n   ${error}\n\n  --->  [${comp.name}]\n`)
  }
}