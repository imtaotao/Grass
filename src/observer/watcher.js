import { parsePath } from './util'
import { pushTarget, clearTarget } from './dep'
import * as _ from '../utils'

export default class Watcher {
  constructor (compnent, expreOrFn, cb) {
    this.cb = cb
    this.compnent = compnent
    /**
     * Two groups, one group aviod repeated additions in once compilation,
     * and one group avniod repeated additions in multiple compilation.
     * */
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()

    if (typeof expreOrFn === 'function') {
      this.getter = expreOrFn
    } else {
      this.getter = parsePath(expreOrFn)
    }

    this.get()
  }

  get () {
    pushTarget(this)
    const compnent = this.compnent
    const data = compnent.state

    this.getter.call(compnent, data)

    clearTarget()
    this.cleanupDeps()
  }

  /**
   * 1. When the 'newDepIds' attribute use to that once get value avoid collect repeat value.
   * 2. The values of the newDepIds and newDeps properties are cleared each time the evaluation and collection observers complete,
   *    and save this to 'depIds' and 'dep' attribute.
   * 3. 'depIds' attribute use to avoid repeat get values collect repeat observer.
   */
  addDep (dep) {
    const id = dep.id
    // If no saved this id of dep, we can continue.
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      // Save it
      this.newDeps.push(dep)
      // If no saved in depIds, represent no saved in old collect.
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  cleanupDeps () {
    // We need clean up no require dep.
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      // If newDepIds no exsit this dep, represent need remove this.
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }

    let tmp = this.depIds
    // Clean up old depids, emptying newDepIds.
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()

    // Ditto
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  update (newValue, oldValue) {
    this.cb.call(this.compnent, newValue, oldValue)
  }
}