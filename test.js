import * as v from './core/create-vdom'
import createElement from './core/create-element'
import { diff } from './core/diff'
import patch from './core/patch'
const el = v.default

export function test () {
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
	console.log(patches)
}