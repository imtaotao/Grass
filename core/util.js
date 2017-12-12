export function typeOf (val) {
	return Object.prototype.toString.call(val)
}

export function random (max, min) {

}

export function isString (str) {
	return typeOf(str) === '[object String]'
}

export function isObject (obj) {
	return typeOf(obj) === '[object Object]'
}

export function isNumber (num) {
	return typeOf(num) === '[object Number]' && !isNaN(num)
}

export function isFunction (fun) {
	return typeOf(fun) === '[object Function]'
}

export function log (...args) {
  console.log(...args)
}

export function dir (...args) {
  console.dir(...args)
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
  if (Array.isArray(arr)) {
    const length = arr.length
    for (; i < length; i++) {
      if (cb(arr[i], i) === false) {
        return
      }
    }
    return
  }

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








