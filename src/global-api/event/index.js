import baseObserver from './base'

export default function extendEvent (compClass) {
  if (!compClass || hasExpanded(compClass)) return

  let isDone = false
  const nextOB = new baseObserver
  const doneOB = new baseObserver
  const errorOB = new baseObserver

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
    }
    return this
  }

  compClass.prototype.error = function _error (reason) {
    if (!isDone) {
      errorOB.emit(creataError(reason))
      isDone = true
    }
    return this
  }

  compClass.$destroy = compClass.prototype.$destroy = function $destroy () {
    console.log('event destroy');
    down = false
    nextOB.remove()
    doneOB.remove()
    errorOB.remove()
  }
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