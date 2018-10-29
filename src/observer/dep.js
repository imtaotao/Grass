import { remove } from "../utils";

let uid = 0

export default class Dep {
  constructor () {
    this.id = uid++
    this.subs = []
    this.subsIds = new Set()
  }

  addSub (sub) {
    if (!this.subsIds.has(sub.id)) {
      this.subsIds.add(sub.id)
      this.subs.push(sub)
    }
  }

  removeSub (sub) {
    this.subsIds.delete(sub.id)
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify (newValue, oldValue) {
    const subs = this.subs.slice()
    for (let i = 0, len = subs.length; i < len; i++) {
      subs[i].update(newValue, oldValue)
    }
  }
}

Dep.target = null
const targetStack = []

export function pushTarget (_target) {
  if (Dep.target) {
    targetStack.push(_target)
  }
  Dep.target = _target
}

export function clearTarget () {
  Dep.target = targetStack.pop()
}