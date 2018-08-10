import * as _ from '../utils'
import createVnode from './createVnode'
import { diff, patch, create } from 'virtual-dom'

export default class Component {
  constructor () {
    this.state = {}
    this.catchState  = {
      setStateFlag: true,
      ast: createAst(this.template),
    }
  }

  setState (newState) {
    if (typeof newState === 'function') {
      newState = state(this.state)
    }

    this.state = Object.assign({}, this.state, newState)

		if (this.catchStat.setStateFlag) {
      this.catchStat.setStateFlag = false
			Promise.resolve().then(() => {
        // xxxx
				this.catchStat.setStateFlag = true
			})
		}
  }

  $createVnode () {
    return createVnode(this)
  }
}

export function createElement (comp) {
  const baseComp = new Component
  Object.setPrototypeOf(comp, baseComp)

  return comp
}

function createAst (template) {
  if (!_.isString(template)) {
    _.warn(`Component template must a "string", But now is "${typeof template}"`)
    return {}
  }

  const ast = parseHtml(template.trim())
  optimize(ast[0] || {})
  return ast
}