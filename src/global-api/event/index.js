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
  let nextOB = new baseObserver
  let doneOB = new baseObserver
  let errorOB = new baseObserver

  compClass.on = function on (callback) {
    if (typeof callback === 'function') {
      nextOB.on(callback)
    }
    return compClass
  }

  compClass.once = function once (callback) {
    if (typeof callback === 'function') {
      nextOB.once(callback)
    }
    return compClass
  }

  compClass.done = function done (callback) {
    if (typeof callback === 'function') {
      doneOB.on(callback)
    }
    return compClass
  }

  compClass.error = function error (callback) {
    if (typeof callback === 'function') {
      errorOB.on(callback)
    }
    return compClass
  }


  compClass.prototype.next = function _next (val) {
    if (!isDone) {
      nextOB.emit(val)
    }
    return this
  }

  compClass.prototype.done = function _done (val) {
    if (!isDone) {
      doneOB.emit(val)
      isDone = true
      remove()
    }
  }

  compClass.prototype.error = function _error (reason) {
    if (!isDone) {
      errorOB.emit(creataError(reason))
      isDone = true
      remove()
    }
  }

  compClass.remove = compClass.prototype.remove = remove

  function remove (fun) {
    nextOB.remove(fun)
    doneOB.remove(fun)
    errorOB.remove(fun)
  }


  return compClass
}

function hasExpanded (compClass) {
  if (!compClass.$destroy) return false
  return compClass.$destroy === compClass.prototype.$destroy
}

function creataError (reason) {
  try {
    throw Error(reason)
  } catch (err) {
    return err
  }
}