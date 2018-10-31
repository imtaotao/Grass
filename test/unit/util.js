import Grass from '../../src'

export function createComp (obj, name = 'DefalutComp') {
  let classBody = ''
  let haveCtor = false
  const keys = Object.keys(obj)

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]
    const method = obj[key]

    if (typeof method === 'function') {
      classBody += method.toString().replace(/^function[\s\s]+/, '') + '\n'
    }

    if (key === 'constructor') {
      haveCtor = true
    }
  }

  if (!haveCtor) {
    classBody += `constructor (...args) {
      super(...args)
    }`
  }

  return Function('Grass', `
    return class ${name} extends Grass.Component {
      ${classBody}
    }
  `)(Grass)
}

export function throwComponent (cm) {
  return () => {
    try {
      cm.mount()
    } catch (err) {
      throw new Error('rethrow')
    }
  }
}