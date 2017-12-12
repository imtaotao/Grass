import vnode from './core/create-vdom'
import { diff } from './core/diff'
import patch from './core/patch'
import * as _ from './core/util'

export function test () {
  // text()
	reorder()
}


function text () {
  var root = vnode('div', {id: 'content'}, [
    vnode('p', ['I love you']),
    vnode('div', ['I love you']),
    vnode('section', ['I love you'])
  ])

  var root2 = vnode('div', [
    vnode('p', ['I love you']),
    vnode('div', {name: 'Jerry'}, ['I love you']),
    vnode('section', ['I love you, too'])
  ])

  var dom = root.render()
  document.body.appendChild(dom)

  _.log(dom)
  var patches = diff(root, root2)
  setTimeout(() => {
    patch(dom, patches)
    _.log(dom)
  }, 3000)
}

function reorder () {
  var oldRoot = vnode('ul', {id: 'list'}, [
      vnode('li', {key: 'a'}),
      vnode('li', {key: 'b'}),
      vnode('li', {key: 'c', style: 'shit'}),
      vnode('li', {key: 'd'}),
      vnode('li', {key: 'e'})
    ])

    var newRoot = vnode('ul', {id: 'lsit'}, [
      vnode('li', {key: 'a'}),
      vnode('li', {key: 'c'}),
      vnode('li', {key: 'e'}),
      vnode('li', {key: 'd'}),
      vnode('li', {key: 'b', name: 'Jerry'})
    ])

  var dom = oldRoot.render()
  document.body.appendChild(dom)
  const patches = diff(oldRoot, newRoot)
  setTimeout(() => {
    patch(dom, patches)
  }, 3000)
}