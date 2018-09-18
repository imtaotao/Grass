import * as _ from '../../utils'

/**
 * 现在的问题动画的问题是，新增的 dom 元素会把正在动画过程中的 dom 元素给替换掉
 * 所以，现在要么尽量少用这种结构，要么在一个 dom 元素动画过程中，有新的 dom 插入
 * 或者生成，立即停止掉其他正在动画的元素，但是这样就只能允许同一时间只能唯一动画
 * 所以，我们最好用 v-show 来动画，这样没有 dom 的变动
 */

export const REMOVEQUEUE = {}

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
  if (
      window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition'
    transitionEndEvent = 'webkitTransitionEnd'
  }

  if (
      window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation'
    animationEndEvent = 'webkitAnimationEnd'
  }
}

export function enter (node, vnode, isStyle) {
  return new Promise(resolve => {
    const { vTransitionType, vTransitionData } = vnode

    if (!vTransitionType) {
      return resolve()
    }

    if (!isStyle) {
      const preRemove = REMOVEQUEUE[vnode.$id]
      if (typeof preRemove === 'function') {
        preRemove()
      }
    }

    const { name, hookFuns } = vTransitionData
    const type = vTransitionType === 'transtion'
      ? TRANSITION
      : ANIMATION

    if (typeof hookFuns['v-beforeEnter'] === 'function') {
      if (hookFuns['v-beforeEnter'](node) === false) {
        return resolve()
      }
    }

    const {
        enterClass,
        enterActiveClass,
        enterToClass,
    } = autoCssTransition(name)

    addTransitionClass(node, enterClass)
    addTransitionClass(node, enterActiveClass)

    nextFrame(() => {
      addTransitionClass(node, enterToClass)
      removeTransitionClass(node, enterClass)

      whenTransitionEnds(node, type, () => {
        removeTransitionClass(node, enterToClass)
        removeTransitionClass(node, enterActiveClass)

        if (typeof hookFuns['v-afterEnter'] === 'function') {
          hookFuns['v-afterEnter'](node)
        }

        resolve()
      })
    })
  })
}

export function leave (node, vnode, isStyle) {
  return new Promise(resolve => {
    const { vTransitionType, vTransitionData } = vnode

    if (!vTransitionType) {
      return resolve()
    }
    
    const { name, hookFuns } = vTransitionData
    const type = vTransitionType === 'transtion'
      ? TRANSITION
      : ANIMATION

    if (typeof hookFuns['v-beforeLeave'] === 'function') {
      if (hookFuns['v-beforeLeave'](node) === false) {
        return resolve()
      }
    }
  
    const {
        leaveClass,
        leaveActiveClass,
        leaveToClass,
    } = autoCssTransition(name)

    addTransitionClass(node, leaveClass)
    addTransitionClass(node, leaveActiveClass)

    nextFrame(() => {
      addTransitionClass(node, leaveToClass)
      removeTransitionClass(node, leaveClass)

      whenTransitionEnds(node, type, () => {
        removeTransitionClass(node, leaveToClass)
        removeTransitionClass(node, leaveActiveClass)

        if (typeof hookFuns['v-afterLeave'] === 'function') {
          hookFuns['v-afterLeave'](node)
        }

        resolve()
      })
    })
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