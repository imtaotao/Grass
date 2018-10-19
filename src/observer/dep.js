import { remove } from "../utils";

let uid = 0

export default class Dep {
  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  removeSub (sub) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    const subs = this.subs.slice()
    for (let i = 0, len = subs.length; i < len; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null

export function pushTarget (_target) {
  Dep.target = _target
}

export function clearTarget () {
  Dep.target = null
}