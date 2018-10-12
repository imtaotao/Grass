// 虽然有性能浪费，但我们要保证 for 循环得到的变量在其他指令中都能用上
// v-if 第二个执行，因为 if 可能为 false，我们尽量避免不必要的指令执行
export const TRANSITION = 0
export const TEXT = 1
export const SHOW = 2
export const ON = 3
export const BIND = 4
export const IF = 5
export const FOR = 6

const directWeight = {
  'v-show': SHOW,
  'v-for': FOR,
  'v-on': ON,
  'v-text': TEXT,
  'v-bind': BIND,
  'v-if': IF,
  'v-transition': TRANSITION,
}

const TRANSITIONHOOK = ['v-beforeEnter', 'v-afterEnter', 'v-beforeLeave', 'v-afterLeave']

export const DIRECTLENGTH = Object.keys(directWeight).length

export function getWeight (directive) {
  let wight = directWeight[directive]
  if (directive.includes('v-bind')) wight = BIND
  if (directive.includes('v-on')) wight = ON
  if (directive.includes('v-transition')) wight = TRANSITION

  return wight
}

export function isReservedDirective (directive) {
  return directive.includes('v-') && (getWeight(directive) !== undefined)
}

export function isTransitionHook (directive) {
  return TRANSITIONHOOK.includes(directive)
}

export function splitDirective (directiveKey) {
  const args = directiveKey.split('.')
  const directive = args[0]
  const modifiers = args.splice(1)

  return { directive, modifiers }
}