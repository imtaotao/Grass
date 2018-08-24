import * as _ from '../utils/index'
import Direct from './container'

const directContainer = Object.create(null)

export function customDirective (direct, callback) {
  directContainer['v-' + direct] = Direct.of(callback)
  return this
}

export function haveRegisteredCustomDirect (key) {
  return _.hasOwn(directContainer, key)
}

export function elementCreated (dom, direaction) {
  if (!direaction || _.isEmptyObj(direaction)) return
  const keys = Object.keys(direaction)

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]
    const val = directContainer[key]
    val.safePipe(callback => {
      callback(dom, direaction[key])
    })
  }
}