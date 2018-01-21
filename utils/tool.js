import { isObject } from './type-check'

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
  if (
      Array.isArray(arr) || 
      (isObject(arr) && arr.length)
  ) {
    const length = arr.length
    for (; i < length; i++) {
      if (cb(arr[i], i) === false) {
        return
      }
    }
    return
  }

  // Deal object
  if (isObject(arr)) {
    const keyName = Object.keys(arr)
    const length  = keyName.length
    for (; i < length; i++) {
      if (cb(arr[keyName[i]], keyName[i]) === false) {
        return
      }
    }
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function remove (arr, item) {
  if (!Array.isArray(arr)) return
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

export function logtag (node, name, callback) {
  if (node.tagName === name) {
    console.log('元素 【'+ name +'】 为:', node)
    callback && callback(node)
  }
}

export function logid (node, id, callback) {
  if (!node.attrs) return
  const searchId = node.attrs.find((val) => {
    if (val.id != null) {
      return val
    }
  })
  if (searchId && searchId.id === id) {
    console.log('元素 【'+ node.tagName +'】 为:', node)
    callback && callback(node)
  }
}