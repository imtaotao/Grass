import { isPlainObject } from './type-check'

export function random (max = 100000, min = 0, fractionDigits = 0) {
  return +(Math.random() * (max - min) + min).toFixed(fractionDigits)
}

export function setAttr (node, key, value) {
  if (!value && value !== 0) {
    node.removeAttribute(key)
    return
  }
  switch (key) {
    case 'style' :
      node.style.cssText = value
      break
    case 'value' :
      var tagName = node.tagName || ''
      tagName = tagName.toLowerCase()
      if (
        tagName === 'input' || tagName === 'textarea'
      ) {
        node.value = value
      } else {
        // if it is not a input or textarea, use `setAttribute` to set
        node.setAttribute(key, value)
      }
      break
    default:
      node.setAttribute(key, value)
      break
  }
}

export function each (arr, cb) {
  let i = 0
  // Deal array and like-array
  if (Array.isArray(arr) || arr.length) {
    const length = arr.length
    for (; i < length; i++) {
      if (cb(arr[i], i, i) === false) return
    }
    return
  }

  // Deal object
  if (isPlainObject(arr)) {
    const keyName = Object.keys(arr)
    const length  = keyName.length
    for (; i < length; i++) {
      if (cb(arr[keyName[i]], keyName[i], i) === false) {
        return
      }
    }
  }
}

export function unique (arr) {
  const res = []
  for(let i = 0, len = arr.length; i < len; i++) {
    for(let j = i + 1; j < len; j++) {
      if (arr[i] === arr[j]) {
        j = ++i
      }
    }
    res.push(arr[i])
  }
  return res
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function toNumber (val) {
  const n = parseFloat(val);
  return isNaN(n) ? val : n
}

export function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

export function extend (to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

export function isEmptyObj (obj) {
  for (const val in obj) {
    return false
  }
  return true
}

export function setOnlyReadAttr (obj, key, val) {
  Object.defineProperty(obj, key, {
    get () { return val }
  })
}

export function isUndef (val) {
  return val === undefined || val === null
}

export function isDef (val) {
  return val !== undefined && val !== null
}

export function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

export const hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)

export function once (fun) {
  let called = false
  return function () {
    if (!called) {
      called = true
      return fun.apply(this, arguments)
    }
  }
}

export function warn (msg, noError) {
  const errorInfor = `[Grass tip]: ${msg}`
  if (noError) {
    console.warn(errorInfor)
    return
  }

  throw Error(errorInfor)
}

export function grassWarn (msg, compName) {
  const errorInfor = `[Grass tip]: ${msg}  \n\n    --->  ${compName || 'unknow'}\n`

  throw Error(errorInfor)
}