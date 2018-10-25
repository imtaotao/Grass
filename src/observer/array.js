import { def } from './util'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

for (let i = 0, len = methodsToPatch.length; i < len; i++) {
  const method = methodsToPatch[i]
  const original = arrayProto[method]

  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }

    // If array is add new member, we need let new meber transfer to response data
    if (inserted) {
      ob.observeArray(inserted)
    }

    ob.dep.notify()
    return result
  })
}