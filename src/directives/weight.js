// 虽然有性能浪费，但我们要保证 for 循环得到的变量在其他指令中都能用上
// v-if 第二个执行，因为 if 可能为 false，我们尽量避免不必要的指令执行
export const TRANSITION = 0
export const ANIMATION = 1
export const TEXT = 2
export const SHOW = 3
export const ON = 4
export const BIND = 5
export const IF = 6
export const FOR = 7

const directWeight = {
  'v-show': SHOW,
  'v-for': FOR,
  'v-on': ON,
  'v-text': TEXT,
  'v-bind': BIND,
  'v-if': IF,
  'v-transition': TRANSITION,
  'v-animation': ANIMATION,
}

const TRANSITIONHOOK = ['v-beforeEnter', 'v-afterEnter', 'v-beforeLeave', 'v-afterLeave']

export const DIRECTLENGTH = Object.keys(directWeight).length

export function getWeight (direct) {
  let wight = directWeight[direct]
  if (direct.includes('v-bind')) wight = BIND
  if (direct.includes('v-on')) wight = ON

  return wight
}

export function isReservedDirect (direct) {
  return direct.includes('v-') && (getWeight(direct) !== undefined)
}

export function isTransitionHook (direct) {
  return TRANSITIONHOOK.includes(direct)
}