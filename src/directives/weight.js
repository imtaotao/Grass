// 我们要保证 for 循环得到的变量在其他指令中都能用上
// v-if 第二个执行，因为 if 可能为 false，我们尽量避免不必要的指令执行
export const TEXT = 0
export const SHOW = 1
export const ON = 2
export const BIND = 3
export const IF = 4
export const FOR = 5

const directWeight = {
  'v-show': SHOW,
  'v-for': FOR,
  'v-on': ON,
  'v-text': TEXT,
  'v-bind': BIND,
  'v-if': IF
}

export const DIRECTLENGTH = Object.keys(directWeight).length

export function getWeight (direct) {
  let wight = directWeight[direct]
  if (direct.includes('v-bind')) wight = BIND
  if (direct.includes('v-on')) wight = ON

  return wight
}

export function isConstomDirect (direct) {
  return direct.includes('v-') && !directWeight[direct]
}