function typeOf (val) {
	return Object.prototype.toString.call(val)
}

export function random (max, min) {

}

export function isString (str) {
	return typeOf(str) === '[object String]'
}

export function isObject (obj) {
	return typeOf(str) === '[object Object]'
}

export function isNumber (num) {
	return typeOf(str) === '[object Number]' && !isNaN(num)
}

export function isFunction (fun) {
	return typeOf(str) === '[object Function]'
}

export function setAttr (node, key, value) {
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