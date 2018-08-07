import * as _ from '../utils'

const priorityWeight = {
  'v-show': 0,
  'v-for': 1,
  'v-on': 2,
  'v-text': 3,
  'v-bind': 4,
  'v-if': 5
}

export function priority (order) {
  let wight = priorityWeight[order]
  if (order.includes('v-bind')) wight = 4
  if (order.includes('v-on')) wight = 2

  return wight
}