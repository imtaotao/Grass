import * as _ from '../utils/index'
import { render } from './render'
import { diff, patch } from '../virtual-dom/index'
import { cacheComponentDomAndVTree } from './component-vnode'

const CAPACITY = 1024

export function enqueueSetState (component, partialState) {
  if (isLegalState(partialState)) {
    const data = component.$data

    if (!data.stateQueue.length) {
      batchUpdateQueue(component)
    }

    data.stateQueue.push(partialState)
  }
}

/**
 *  We can use batch update in asynchronous task, this can be avioded non-stop render
 *  do it, we no need everytime to diff and patch
 **/
function batchUpdateQueue (component) {
  Promise.resolve().then(() => {
    const queue = component.$data.stateQueue
    let state = Object.assign({}, component.state)
    let index = 0

    while (index < queue.length) {
      const currentIndex = index
      index++
      state = mergeState(state, queue[currentIndex])

      if (index > CAPACITY) {
        const newLength = queue.length - index
        for (let i = 0; i < newLength; i++) {
          queue[i] = queue[index + i]
        }
        queue.length -= index
        index = 0
      }
    }

    queue.length = 0
    component.state = state
    updateDomTree(component)
  })
}

export function updateDomTree (component) {
  const vnode = component.$widgetVNode
  const { dom, vtree } = vnode.container
  
  if (!component.noStateComp) {
    component.willUpdate(dom)
  }

  const ast = component.constructor.$ast
  const newTree = render(vnode, ast)
  const patchs = diff(vtree, newTree)

  patch(dom, patchs)
 
  if (!component.noStateComp) {
    component.didUpdate(dom)
  }

  cacheComponentDomAndVTree(vnode, newTree, dom)
}

function mergeState (state, partialState) {
  if (typeof partialState === 'function') {
    const newState = partialState(state)
    return _.isPlainObject(newState)
      ? newState
      : state
  }

  return _.isEmptyObj(partialState)
    ? state
    : Object.assign({}, state, partialState)
}

// We allow the use of callback function to render
function isLegalState (state) {
  return _.isPlainObject(state) || typeof state === 'function'
}