import * as _ from '../utils'
import { TEXT, STATICTAG, TAG} from './parse-html'

const genStaticKeysCached = _.cached(genStaticKeys)
let isStaticKey, isPlatformReservedTag

export function optimize (astRoot, options = {}) {
	if (!astRoot.root) return
	isStaticKey = genStaticKeysCached(options.staticKeys || '')
	isPlatformReservedTag = _.isReservedTag || _.no

	_.log(isPlatformReservedTag)
}
function markStatic (node) {}

function genStaticKeys (keys) {
  return _.makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}