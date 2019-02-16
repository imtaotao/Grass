import * as _ from '../utils'
import bind from '../directives/bind'
import { vText } from '../directives/util'

export function migrateComponentStatus (outputNode, acceptNode) {
  if (!outputNode || !acceptNode) return

  transitionDirect(outputNode, acceptNode)
  transitionClass(outputNode, acceptNode)
}

export function shouldForceUpdate (node) {
  if (_.hasOwn(node, 'vTextResult')) return 'text'
  if (_.hasOwn(node, 'vShowResult')) return 'show'
  if (_.hasOwn(node, 'vTransitionType')) return 'transition'
  return false
}

/**
 * Transfer direct data
 * "vTextResult、vShowResult、vTransitionType、vTransitionData"
 **/ 
function transitionDirect (O, A) {
  if (_.hasOwn(O, 'vTextResult')) {
    const res = O['vTextResult']
    A.children.unshift(
      vText(_.toString(res), A)
    )
  }

  if (_.hasOwn(O, 'vShowResult')) {
    const res = O['vShowResult']
    A.isShow = res
    bind(res, null, A)
  }

  if (_.hasOwn(O, 'vTransitionType')) {
    A['vTransitionType'] = O['vTransitionType']
    A['vTransitionData'] = O['vTransitionData']
  }
}

// 
/**
 * Transfer direct some special props
 * "className, indexKey"
 **/
function transitionClass (O, A) {
  if (_.hasOwn(O.attrs, 'className')) {
    const outputClassName = O.attrs['className']
    const acceptClassName = A.attrs['className']

    if (acceptClassName) {
      A.attrs['className'] = outputClassName + ' ' + acceptClassName
    } else {
      A.attrs['className'] = outputClassName
    }
  }

  if (_.hasOwn(O.attrs, 'styleName')) {
    const outputStyleName = O.attrs['styleName']
    const acceptStyleName = A.attrs['styleName']

    if (acceptStyleName) {
      A.attrs['styleName'] = outputStyleName + ' ' + acceptStyleName
    } else {
      A.attrs['styleName'] = outputStyleName
    }
  }
}