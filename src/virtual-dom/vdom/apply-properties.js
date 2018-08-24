export default function applyProperties(node, props, previous) {
  for (let propName in props) {
    const propValue = props[propName]

    if (propValue === undefined) {
      removeProperty(node, propName, propValue, previous)
    } else if (isObject(propValue)) {
      patchObject(node, propName, propValue, previous)
    } else {
      node[propName] = propValue
    }
  }
}

function removeProperty (node, propName, previous) {
  if (!previous) {
    return
  }

  const previousValue = previous[propName]

  if (propName === 'attributes') {
    for (let attrName in previousValue) {
      node.removeAttribute(attrName)
    }
  } else if (propName === 'style') {
    for (let styleName in previousValue) {
      node.style[styleName] = ''
    }
  } else if (typeof previousValue === 'string') {
    node[propName] = ''
  } else {
    node[propName] = null
  }
}

function patchObject (node, propName, propValue, previous) {
  const previousValue = previous
    ? previous[propName]
    : undefined

  if (propName === 'attributes') {
    for (let attrName in propValue) {
      const attrValue = propValue[attrName]

      attrValue === undefined
        ? node.removeAttribute(attrName)
        : node.setAttribute(attrName, attrValue)
    }
    return
  }

  if (previousValue && isObject(previousValue)) {
    if (Object.getPrototypeOf(previousValue) !== Object.getPrototypeOf(propValue)) {
      node[propName] = propValue
      return
    }
  }

  // 我们对 props 为 {} 的属性进行 apply。例如 "style"
  if (!isObject(node[propName])) {
    node[propName] = {}
  }

  const replacer = propName === 'style'
    ? ''
    : undefined

  for (let key in propValue) {
    const value = propValue[key]

    node[propName][key] = value === undefined
      ? replacer
      : value
  }
}

function isObject(x) {
	return typeof x === 'object' && x !== null
}