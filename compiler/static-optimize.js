import * as _ from '../utils'
import { TEXT, STATICTAG, TAG} from './parse-html'

const genStaticKeysCached = _.cached(genStaticKeys)
let isStaticKey, isPlatformReservedTag

export function optimize (astRoot, options = {}) {
	if (!astRoot.root) return
	isStaticKey = genStaticKeysCached(options.staticKeys || '')
	isPlatformReservedTag = _.isReservedTag || _.no

	// 第一遍：标记所有非静态节点
	markStatic(astRoot)
	// 第二遍：标记静态根节点
	markStaticRoots(astRoot, false)
}

function markStatic (node) {
	node.static = isStatic(node)
	if (node.type === TAG) {
		if (!node.attrs.length && !node.direction.length) {
			node.plain = true
		}
		if (
				!isPlatformReservedTag(node.tagName) &&
				!_.isInserComponents(node.tagName) &&
				node.attrs['inline-template'] == null
		) {
			return
		}

		_.each(node.children, (child, i) => {
			markStatic(child)
			if (!child.static) {
				node.static = false
			}
		})
	}
}

function markStaticRoots (node, isInFor) {
	if (node.type === TAG) {
		if (node.static) {
			node.staticInFor = isInFor
		}
		// 对于一个有资格作为静态跟节点的元素，他应该有children
		// 而且子元素不应该是一个纯静态文本，否则消耗会超过获得的收益
		// 更好的做法让它每次渲染时都刷新
		if (node.static && node.children.length && !(
			node.children.length === 1 &&
			node.children[0].type === TEXT
		)) {
			node.staticRoot = true
			return
		} else {
			node.staticRoot = false
		}
		if (node.children.length) {
			_.each(node.children, (child, i) => {
				markStaticRoots(child, isInFor || !!node.for)
			})
		}
	}
}

function isStatic (node) {
	if (node.type === STATICTAG) {
		return false
	}
	if (node.type === TEXT) {
		return true
	}

	return !!(
		!node.hasBindings() &&
		!_.isBuiltInTag(node.tagName) &&
		!node.if && !node.for &&
		isPlatformReservedTag(node.tagName) &&
		!isDirectChildOfTemplateFor(node) &&
		Object.keys(node).every(isStaticKey)
	)
}

// template的直接子元素且在for中
function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent
    if (node.tagName !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

function genStaticKeys (keys) {
  return _.makeMap(
    // 'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    'type,tagName,,attrs,direction,parent,children,attrs,start,end,root,isUnaryTag,hasBindings' +
    (keys ? ',' + keys : '')
  )
}