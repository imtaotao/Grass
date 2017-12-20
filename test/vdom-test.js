import { vnode, diff, patch } from '../test'
import * as _ from '../utils'

export function test () {
  // text()
	reorder()
}


function text () {
  const root = vnode('div', {id: 'content'}, [
    vnode('p', ['I love you']),
    vnode('div', ['I love you']),
    vnode('section', ['I love you'])
  ])

  const root2 = vnode('div', [
    vnode('p', ['I love you']),
    vnode('div', {name: 'Jerry'}, ['I love you']),
    vnode('section', ['I love you, too'])
  ])

  const dom = root.render()
  document.body.appendChild(dom)

  _.log(dom)
  const patches = diff(root, root2)
  setTimeout(() => {
    patch(dom, patches)
    _.log(dom)
  }, 3000)
}

function reorder () {
  const oldRoot = vnode('ul', {id: 'list'}, [
      vnode('li', {key: 'a'}),
      vnode('li', {key: 'b'}),
      vnode('li', {key: 'c', style: 'shit'}),
      vnode('li', {key: 'd'}),
      vnode('li', {key: 'e'})
    ])

    const newRoot = vnode('ul', {id: 'lsit'}, [
      vnode('li', {key: 'a'}),
      vnode('li', {key: 'c'}),
      vnode('li', {key: 'e'}),
      vnode('li', {key: 'd'}),
      vnode('li', {key: 'b', name: 'Jerry'})
    ])

  const dom = oldRoot.render()
  document.body.appendChild(dom)
  const patches = diff(oldRoot, newRoot)
  setTimeout(() => {
    patch(dom, patches)
  }, 3000)
}