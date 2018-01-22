import * as _ from '../utils'
import { TEXT, STATICTAG, TAG} from './parse-html'

const genStaticKeysCached = _.cached(genStaticKeys)
let isStaticKey, isPlatformReservedTag

export function optimize (astRoot, options = {}) {
	if (!astRoot.root) return
	isStaticKey = genStaticKeysCached(options.staticKeys || '')
	isPlatformReservedTag = _.isReservedTag || _.no

	markStatic(astRoot)
}

function markStatic (node) {
	_.log(node.hasBindings(), node)
}

function genStaticKeys (keys) {
  return _.makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function isStatic (node) {
  if (node.type === STATICTAG) { // expression
    return false
  }
  if (node.type === TEXT) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}