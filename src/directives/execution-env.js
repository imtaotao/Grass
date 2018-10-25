import scope from './scope'
import Watcher from '../observer/Watcher'
import * as _ from '../utils/index'
import { updateDomTree } from '../component/update-state'

export default function runExecuteContext (code, directName, tagName, component, callback) {
  const { noStateComp, state, props } = component
  const insertScope = noStateComp ? props : state
  const realData = scope.insertChain(insertScope || {})

  if (directName !== '{{ }}') {
    directName = 'v-' + directName
  }

  const options = {
    code,
    tagName,
    callback,
    component,
    directName,
    state: realData,
  }
  return run(options)
}

function getStateResult (code, component, state, callback) {
  const fun = new Function('$obj_', '$callback_', code)

  if (component.$isWatch && component.$firstCompilation) {
    let value
    
    function update () {
      const data = component.$data

      if (!data.stateQueue.length) {
        Promise.resolve().then(() => {
          updateDomTree(component)
          data.stateQueue.length = 0
        })
      }

      data.stateQueue.push(null)
    }

    new Watcher(component, () => {
      value = fun.call(component, state, callback)
      return value
    }, update)

    return value
  } else {
    return fun.call(component, state, callback)
  }
}

function run ({ code, state, tagName, callback, component, directName }) {
  try {
    return getStateResult(code, component, state, callback)
  } catch (error) {
    _.warn(`Component directive compilation error  \n\n  "${directName}":  ${error}\n\n
    --->  ${component.name}: <${tagName || ''}/>\n`)
  }
}