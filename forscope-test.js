let scope = null
let chain = [scope]

function create () {
  scope = Object.create(scope)
  chain.push(scope)
  return scope
}

function add (key, val) {
  if (typeof key !== 'string') {
    throw 'xxx error'
  }
  scope[key] = val
}

function destroy () {
  chain.pop()
  scope = chain[chain.length - 1]
  return scope
}

