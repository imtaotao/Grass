import * as v from './core/create-vdom'
import { diff } from './core/diff'
import patch from './core/patch'
import * as _ from './core/util'
const el = v.default

export function test () {
  // console.time('tt')
  text()
	// reorder()
  // console.timeEnd('tt')
}


function text () {
  var root = el('div', {id: 'content'}, [
    el('p', ['I love you']),
    el('div', ['I love you']),
    el('section', ['I love you'])
  ])

  var root2 = el('div', [
    el('p', ['I love you']),
    el('div', {name: 'Jerry'}, ['I love you']),
    el('section', ['I love you, too'])
  ])

  var dom = root.render()
  
  var patches = diff(root, root2)
  _.log(patches)
  patch(dom, patches)
}

function reorder () {
  var oldRoot = el('ul', {id: 'list'}, [
      el('li', {key: 'a'}),
      el('li', {key: 'b'}),
      el('li', {key: 'c', style: 'shit'}),
      el('li', {key: 'd'}),
      el('li', {key: 'e'})
    ])

    var newRoot = el('ul', {id: 'lsit'}, [
      el('li', {key: 'a'}),
      el('li', {key: 'c'}),
      el('li', {key: 'e'}),
      el('li', {key: 'd'}),
      el('li', {key: 'b', name: 'Jerry'})
    ])


  const patches = diff(oldRoot, newRoot)
  patch(oldRoot.render(), patches)
}