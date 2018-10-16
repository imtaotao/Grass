import * as _ from '../../utils'

/** 
 * 对于新旧真实节点的渲染，我们可以在每个动画的节点的 parentNode 上面进行缓存，
 * 因为对于新旧真实节点，肯定在同一个父组件上面，我们这样就可以缩小范围，并且可以对比 virtual-dom 的 
 * key 和 tagName，这样就能保证在新节点插入的时候，终止掉旧节点的动画，并删除
*/

const raf = window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout

export function nextFrame (fn) {
  raf(() => {
    raf(fn)
  })
}

export const autoCssTransition = _.cached(name => {
  return {
    enterClass: `${name}-enter`,
    enterToClass: `${name}-enter-to`,
    enterActiveClass: `${name}-enter-active`,
    leaveClass: `${name}-leave`,
    leaveToClass: `${name}-leave-to`,
    leaveActiveClass: `${name}-leave-active`,
  }
})

const TRANSITION = 'transition'
const ANIMATION = 'animation'
export const hasTransition = _.inBrowser && !_.isIE9
export let transitionProp = 'transition'
export let transitionEndEvent = 'transitionend'
export let animationProp = 'animation'
export let animationEndEvent = 'animationend'

if (hasTransition) {
  if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition'
    transitionEndEvent = 'webkitTransitionEnd'
  }

  if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation'
    animationEndEvent = 'webkitAnimationEnd'
  }
}

export function enter (node, vnode, rm) {
  const { vTransitionType, vTransitionData } = vnode.data

  if (!vTransitionType) {
    rm()
    return
  }

  if (_.isDef(node._leaveCb)) {
    node._leaveCb()
  }

  if (node._enterCb) {
    rm()
    return
  }

  const { name, hookFuns } = vTransitionData
  const type = vTransitionType === 'transtion'
    ? TRANSITION
    : ANIMATION

  if (typeof hookFuns['v-beforeEnter'] === 'function') {
    if (hookFuns['v-beforeEnter'](node) === false) {
      rm()
      return
    }
  }

  const { enterClass, enterActiveClass, enterToClass } = autoCssTransition(name)

  const cb = node._enterCb = _.once(() => {
    removeTransitionClass(node, enterToClass)
    removeTransitionClass(node, enterActiveClass)

    if (typeof hookFuns['v-afterEnter'] === 'function') {
      hookFuns['v-afterEnter'](node)
    }

    node._enterCb = null
    rm()
  })

  addTransitionClass(node, enterClass)
  addTransitionClass(node, enterActiveClass)
  nextFrame(() => {
    addTransitionClass(node, enterToClass)
    removeTransitionClass(node, enterClass)
    whenTransitionEnds(node, type, cb)
  })
}

export function leave (node, vnode, rm) {
    const { vTransitionType, vTransitionData } = vnode.data

    if (!vTransitionType) {
      rm()
      return
    }

    if (_.isDef(node._enterCb)) {
      node._enterCb()
    }

    if (node._leaveCb) {
      rm()
      return
    }

    const { name, hookFuns } = vTransitionData
    const type = vTransitionType === 'transtion'
      ? TRANSITION
      : ANIMATION

    if (typeof hookFuns['v-beforeLeave'] === 'function') {
      if (hookFuns['v-beforeLeave'](node) === false) {
        rm()
        return
      }
    }

    const { leaveClass, leaveActiveClass, leaveToClass } = autoCssTransition(name)

    // 记录离开动画的元素
    if (node.parentNode) {
      if (!node.parentNode._pending) {
        node.parentNode._pending = []
      }

      const index = node.parentNode._pending.length

      node._index = index
      node.parentNode._pending[index] = node
    }

    const cb = node._leaveCb = _.once((noRemove) => {
      if (!noRemove && node.parentNode && node.parentNode._pending) {
        node.parentNode._pending[node._index] = null
      }

      removeTransitionClass(node, leaveToClass)
      removeTransitionClass(node, leaveActiveClass)

      if (typeof hookFuns['v-afterLeave'] === 'function') {
        hookFuns['v-afterLeave'](node)
      }

      node._leaveCb = null
      rm()
    })

    addTransitionClass(node, leaveClass)
    addTransitionClass(node, leaveActiveClass)
    nextFrame(() => {
      addTransitionClass(node, leaveToClass)
      removeTransitionClass(node, leaveClass)
      whenTransitionEnds(node, type, cb)
    })
}

function addTransitionClass (node, cls) {
  const transitionClasses = node._transitionClasses || (node._transitionClasses = [])

  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls)
    addClass(node, cls)
  }
}

function removeTransitionClass (node, cls) {
  if (node._transitionClasses) {
    _.remove(node._transitionClasses, cls)
  }

  removeClass(node, cls)
}

function whenTransitionEnds (node, type, cb) {
  let ended = 0
  const { propCount, timeout } = getTransitionInfo(node)
  const event = type === TRANSITION
    ? transitionEndEvent
    : animationEndEvent

  const end = () => {
    node.removeEventListener(event, onEnd)
    cb()
  }

  const onEnd = e => {
    if (++ended >= propCount) {
      end()
    }
  }
  
  setTimeout(() => {
    if (ended < propCount) {
      end()
    }
  }, timeout + 1)

  node.addEventListener(event, onEnd)
}

function getTransitionInfo (node) {
  const styles = window.getComputedStyle(node)
  const transitionDelays = styles[transitionProp + 'Delay'].split(', ')
  const transitionDurations = styles[transitionProp + 'Duration'].split(', ')
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations)
  const propCount = transitionDurations.length
  const timeout = transitionTimeout

  return { propCount, timeout }
}

function getTimeout (delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays)
  }

  return Math.max.apply(null, durations.map((d, i) => {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

export function applyPendingNode(parentNode) {
  const pendingNode = parentNode && parentNode._pending

  if (pendingNode && pendingNode.length) {
    for (let i = 0, len = pendingNode.length; i < len; i++) {
      const node = pendingNode[i]
      node && node._leaveCb && node._leaveCb(true)
    }

    parentNode._pending = []
  }
}

export function addClass (node, cls) {
  if (!cls || !(cls = cls.trim())) {
    return
  }

  // svg 用 setSttribute
  if (node.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(c => node.classList.add(c))
    } else {
      node.classList.add(cls)
    }
  } else {
    const cur = ` ${node.getAttribute('class') || ''} `

    if (cur.indexOf(' ' + cls + ' ') < 0) {
      node.setAttribute('class', (cur + cls).trim())
    }
  }
}

export function removeClass (node, cls) {
  if (!cls || !(cls = cls.trim())) {
    return
  }

  if (node.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(c => node.classList.remove(c))
    } else {
      node.classList.remove(cls)
    }

    if (!node.classList.length) {
      node.removeAttribute('class')
    }
  } else {
    let cur = ` ${node.getAttribute('class') || ''} `
    const tar = ' ' + cls + ' '

    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ')
    }

    cur = cur.trim()

    if (cur) {
      node.setAttribute('class', cur)
    } else {
      node.removeAttribute('class')
    }
  }
}