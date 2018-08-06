import * as _ from '../utils'

const priorityWeight = {
  'v-show': 0,
  'v-for': 1,
  'v-on': 2,
  'v-text': 3,
  'v-if': 4
}

export function priority (order) {
	return priorityWeight[order] || 0
}