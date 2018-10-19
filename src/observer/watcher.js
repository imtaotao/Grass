import {
  pushTarget,
  clearTarget,
} from './dep'

import { parsePath } from './util'

export default class Watcher {
  constructor (compnent, expreOrFn, cb) {
    this.cb = cb
    this.compnent = compnent
    this.depIds = new Set()

    if (typeof expreOrFn === 'function') {
      this.getter = expreOrFn
    } else {
      this.getter = parsePath(expreOrFn)
    }

    this.value = this.get()
  }

  get () {
    pushTarget(this)
    const compnent = this.compnent
    const data = compnent.state
    const value = this.getter.call(compnent, data)
    console.log(value);
    clearTarget()

    return value
  }

  addDep (dep) {
    const id = dep.id
    if (!this.depIds.has(id)) {
      this.depIds.add(id)
      dep.addSub(this)
    }
  }

  update () {
    this.cb()
  }
}

window.ob = Watcher