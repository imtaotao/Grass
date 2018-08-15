const scope = {
  $parent: {}
}
let current = scope

function create () {
  const _c = {
    $parent: current,
  }
  current._c = _c
  current = _c
}

function add (key, val) {
  current[key] = val
}

function get (key, scope) {
  if (!scope) throw 'no'
  if (scope.hasOwnProperty(key)) {
    return scope[key]
  }

  return get(key, scope.$parent)
}

console.log(scope, current);

create()
add('a', 1)
create()
add('b', 2)
console.log(get('c', current));

console.log(scope, current);