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