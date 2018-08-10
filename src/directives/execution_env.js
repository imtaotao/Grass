import * as _ from '../utils'

export default function runExecutContext (runCode, compConf, compName, callback) {
  const fun = new Function('$obj_', '$callback_', runCode)

  return run(fun, compConf, compName, callback)
}

function run (fun, compConf, compName, callback) {
  try {
    return fun.call(compConf, compConf.state || {}, callback)
  } catch (error) {
    _.warn(`Component template compilation error  \n\n   ${error}\n\n  --->  [${compName}]\n`)
  }
}