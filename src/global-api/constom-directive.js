import * as _ from '../utils'

const directContainer = Object.create(null)

class Direct {
  constructor (val) {
    this._value = val
  }

  isUndef () {
    return this._value === undefined || this._value === null
  }

  map (fun) {
    return this.isUndef()
      ? Direct.of(null)
      : Direct.of(fun(this._value))
  }

  static
  of (val) {
    return new Direct(val)
  }
}

window.d = directContainer
export function customDirective (direct, callback) {
  directContainer['v-' + direct] = Direct.of(callback)
}


export function haveRegisteredCustomDirect (key) {
  return _.hasOwn(directContainer, key)
}

export function elementCreated (comp, dom, direaction) {
  if (!direaction || _.isEmptyObj(direaction)) return
  const keys = Object.keys(direaction)

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]
    const val = directContainer[key]
    val.map(callback => {
      callback(comp, dom, direaction[key])
    })
  }
}