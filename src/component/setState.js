// 我们对 setState 进行批量更新
// 不然每一次 setState 都进行一次 diff patch，太伤了
import * as _ from '../utils/index'
import render from './render'
import { diff } from '../virtual-dom/index'
import { patch } from '../virtual-dom/index'
// import { patch } from 'virtual-dom'

const capacity = 1024

export function enqueueSetState (comp, partialState) {
  if (!_.isPlainObject(partialState) && typeof partialState !== 'function') {
    return
  }

  if (!comp.$cacheState.stateQueue.length) {
    updateQueue(comp)
  }

  comp.$cacheState.stateQueue.push(partialState)
}

// TODO 这个地方需要用事务做一手防递归，后续处理
function updateQueue (comp) {
  Promise.resolve().then(() => {
    const queue = comp.$cacheState.stateQueue
    let state = Object.assign({}, comp.state)
    let index = 0

    while (index < queue.length) {
      const currentIndex = index
      index++
      state = mergeState(state, queue[currentIndex])

      if (index > capacity) {
        const newLength = queue.length - index
        for (let i = 0; i < newLength; i++) {
          queue[i] = queue[index + i]
        }
        queue.length -= index
        index = 0
      }
    }

    queue.length = 0
    comp.state = state
    updateDomTree(comp)
  })
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

function updateDomTree (comp) {
  const isNoStateComp = comp.noStateComp

  if (!isNoStateComp) {
    comp.willUpdate()
  }

  const ast = comp.constructor.$ast
  const dom = comp.$cacheState.dom
  const oldTree = comp.$cacheState.vtree
  const newTree = render(comp.$parentConf, ast, comp)
  console.log(newTree, typeof newTree);
  const patchs = diff(oldTree, newTree)

  patch(dom, patchs)
 
  updateChildComp(comp)

  if (!isNoStateComp) {
    comp.didUpdate(dom)
  }

  comp.$cacheState.vtree = newTree
  comp.$parentConf = null
}

function updateChildComp (comp) {
  const cacheChild = comp.$cacheState.childComponent
  const keys = Object.keys(cacheChild)

  for (let i = 0, len = keys.length; i < len; i++) {
    const childs = cacheChild[keys[i]]

    for (let j = 0, length = childs.length; j < length; j++) {
      const child = childs[j]

      if (child && child.$parentConf) {
        const parentConf = child.$parentConf
        const newProps = _.getProps(parentConf.attrs)

        if (child.noStateComp) {
          child.props = newProps
          child.setState({})
        } else {
          const needUpdate = child.willReceiveProps(newProps)

          if (needUpdate !== false) {
            child.props = newProps
            child.setState({})
          }
        }
      }
    }
  }
}