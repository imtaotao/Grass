const raf = window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout

export function nextFrame (fn) {
  raf(() => {
    raf(fn)
  })
}

export let transitionProp = 'transition'
export let transitionEndEvent = 'transitionend'

if (hasTransition) {
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition'
    transitionEndEvent = 'webkitTransitionEnd'
  }
}

export function addTransitionClass (node, cls) {
  
}

export function removeTransitionClass (node, cls) {
  
}

export function whenTransitionEnds (el, cb) {
  el.addEventListener(event, onEnd)
}