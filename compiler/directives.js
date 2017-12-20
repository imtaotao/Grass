import * as _ from '../utils'

const priorityObj = {
  'v-show': 0,
  'v-on': 1,
  'v-for': 2,
  'v-text': 3,
  'v-if': 4
}

export function priority (directive) {
	return priorityObj[directive]
}