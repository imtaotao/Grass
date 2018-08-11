export const SHOW = 0
export const FOR = 1
export const ON = 2
export const TEXT = 3
export const BIND = 4
export const IF = 5

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