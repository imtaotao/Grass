import baseObserver from './base'
import * as _ from '../../utils/index'

export default function extendEvent (compClass) {
  if (!_.isClass(compClass)) {
    _.grassWarn('Cannot create observers for stateless components', compClass.name)
    return
  }

  if (!compClass || hasExpanded(compClass)) {
    return compClass
  }

  let isDone = false
  let nextOB = new baseObserver()
  let doneOB = new baseObserver()
  let errorOB = new baseObserver()

  function on (callback) {
    if (typeof callback === 'function') {
      nextOB.on(callback)
    }

    return compClass
  }

  function once (callback) {
    if (typeof callback === 'function') {
      nextOB.once(callback)
    }

    return compClass
  }

  function done (callback) {
    if (typeof callback === 'function') {
      doneOB.on(callback)
    }

    return compClass
  }

  function error (callback) {
    if (typeof callback === 'function') {
      errorOB.on(callback)
    }

    return compClass
  }

  /**
   * We don't to inspection to 'type', maybe the type is a 'undefiend', but it's normal.
   * This 'function' is only provide help function, if you need type tag
   **/ 
  function listener (type, callback) {
    if (typeof callback === 'function') {
      const cb = (val) => {
        if (val && !_.isPrimitive(val)) {
          if (val.type === type) {
            callback(val.data)
          }
        }
      }

      nextOB.on(cb)
      callback._parentCb = cb
    }

    return compClass
  }

  function prototypeNext (val) {
    if (!isDone) {
      nextOB.emit(val)
    }
    return this
  }

  function prototypeDone (val) {
    if (!isDone) {
      doneOB.emit(val)
      isDone = true
      remove()
    }
  }

  function prototypeError (reason) {
    if (!isDone) {
      if (errorOB.commonFuns.length || errorOB.onceFuns.length) {
        errorOB.emit(reason)
      } else {
        throw new Error(reason)
      }

      isDone = true
      remove()
    }
  }

  function prototypeNextHelp (type, data) {
    this.next({type, data})
    return this
  }

  function remove (fun) {
    if (fun && typeof fun._parentCb === 'function') {
      fun = fun._parentCb
    }
    
    nextOB.remove(fun)
    doneOB.remove(fun)
    errorOB.remove(fun)
  }

  compClass.on = on
  compClass.once = once
  compClass.done = done
  compClass.error = error
  compClass.listener = listener

  compClass.prototype.next = prototypeNext 
  compClass.prototype.done = prototypeDone
  compClass.prototype.error = prototypeError
  compClass.prototype.tNext = prototypeNextHelp

  compClass.remove = compClass.prototype.remove = remove

  return compClass
}

function hasExpanded (compClass) {
  if (!compClass.remove) return false
  return compClass.remove === compClass.prototype.remove
}