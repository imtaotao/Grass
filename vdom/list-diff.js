export function listDiff(aChildren, bChildren) {
	// O(M) time, O(M) memory
	// 得到新tree的 key 和 free
	var bChildIndex = keyIndex(bChildren)
	// 得到 key
	var bKeys = bChildIndex.keys
	var bFree = bChildIndex.free

	// 如果新tree没有一个可以标识的就返回null整体替换
	if (bFree.length === bChildren.length) {
			return {
					children: bChildren,
					moves: null
			}
	}

	// O(N) time, O(N) memory
	// 得到旧数的 key 和 free
	var aChildIndex = keyIndex(aChildren)
	var aKeys = aChildIndex.keys
	var aFree = aChildIndex.free

	// 如果旧tree没有一个可以标识的就返回null整体替换
	if (aFree.length === aChildren.length) {
			return {
					children: bChildren,
					moves: null
			}
	}

	/*
			因为是对新旧两颗数的diff，一般这种情况很可能是两棵树的children元素名是一样的
			比如 ul 下面的li，必须要不一样的key才能分辨具体的元素，进行diff，如果其中一
			颗树连一个具体的key都没有，则无法进行diff，整体替换好了，这也是react种为什么
			需要一个key来提高效率
	*/

	/* --------------------------- */

	// O(MAX(N, M)) memory
	// 新建一个 children 数组用来保存两棵树具体的差异
	var newChildren = []

	var freeIndex = 0
	var freeCount = bFree.length
	var deletedItems = 0

	// Iterate through a and match a node in b
	// 遍历 a 并匹配 b 中的一个节点
	// O(N) time,
	for (var i = 0 ; i < aChildren.length; i++) {
			var aItem = aChildren[i]
			var itemIndex

			// 如果当前旧tree中，当期vnode存在key
			if (aItem.key) {
					if (bKeys.hasOwnProperty(aItem.key)) {
							// Match up the old keys
							// 匹配旧的keys
							itemIndex = bKeys[aItem.key]
							newChildren.push(bChildren[itemIndex])

					} else {
							// Remove old keyed items
							itemIndex = i - deletedItems++
							newChildren.push(null)
					}
			} else {
					// Match the item in a with the next free item in b
					// 将a中的 item 与b中的下一个 free item 进行匹配
					if (freeIndex < freeCount) {
							itemIndex = bFree[freeIndex++]
							newChildren.push(bChildren[itemIndex])
					} else {
							// There are no free items in b to match with
							// the free items in a, so the extra free nodes
							// are deleted.
							itemIndex = i - deletedItems++
							newChildren.push(null)
					}
			}
	}

	var lastFreeIndex = freeIndex >= bFree.length ?
			bChildren.length :
			bFree[freeIndex]

	// Iterate through b and append any new keys
	// 通过b迭代并追加任何新的 keys
	// O(M) time
	for (var j = 0; j < bChildren.length; j++) {
			var newItem = bChildren[j]

			if (newItem.key) {
					if (!aKeys.hasOwnProperty(newItem.key)) {
							// Add any new keyed items
							// We are adding new items to the end and then sorting them
							// in place. In future we should insert new items in place.
							// 添加任何新的键控项目
							// 我们将新项目添加到最后，然后对它们进行排序
							// 到位。 将来我们应该插入新的项目。
							newChildren.push(newItem)
					}
			} else if (j >= lastFreeIndex) {
					// Add any leftover non-keyed items
					newChildren.push(newItem)
			}
	}

	var simulate = newChildren.slice()
	var simulateIndex = 0
	var removes = []
	var inserts = []
	var simulateItem

	for (var k = 0; k < bChildren.length;) {
			var wantedItem = bChildren[k]
			simulateItem = simulate[simulateIndex]

			// remove items
			while (simulateItem === null && simulate.length) {
					removes.push(remove(simulate, simulateIndex, null))
					simulateItem = simulate[simulateIndex]
			}

			if (!simulateItem || simulateItem.key !== wantedItem.key) {
					// if we need a key in this position...
					// 如果我们需要这个位置的 key...
					if (wantedItem.key) {
							if (simulateItem && simulateItem.key) {
									// if an insert doesn't put this key in place, it needs to move
									// 如果一个插入件没有放置这个keys，它需要移动
									if (bKeys[simulateItem.key] !== k + 1) {
											removes.push(remove(simulate, simulateIndex, simulateItem.key))
											simulateItem = simulate[simulateIndex]
											// if the remove didn't put the wanted item in place, we need to insert it
											// 如果删除没有把想要的项目放到位，我们需要插入它
											if (!simulateItem || simulateItem.key !== wantedItem.key) {
													inserts.push({key: wantedItem.key, to: k})
											}
											// items are matching, so skip ahead
											else {
													simulateIndex++
											}
									}
									else {
											inserts.push({key: wantedItem.key, to: k})
									}
							}
							else {
									inserts.push({key: wantedItem.key, to: k})
							}
							k++
					}
					// a key in simulate has no matching wanted key, remove it
					else if (simulateItem && simulateItem.key) {
							removes.push(remove(simulate, simulateIndex, simulateItem.key))
					}
			}
			else {
					simulateIndex++
					k++
			}
	}

	// remove all the remaining nodes from simulate
	while(simulateIndex < simulate.length) {
			simulateItem = simulate[simulateIndex]
			removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
	}

	// If the only moves we have are deletes then we can just
	// let the delete patch remove these items.
	if (removes.length === deletedItems && !inserts.length) {
			return {
					children: newChildren,
					moves: null
			}
	}

	return {
			children: newChildren,
			moves: {
					removes: removes,
					inserts: inserts
			}
	}
}

function remove(arr, index, key) {
	arr.splice(index, 1)

	return {
			from: index,
			key: key
	}
}

function keyIndex(children) {
	var keys = {}
	var free = []
	var length = children.length

	for (var i = 0; i < length; i++) {
			var child = children[i]

			if (child.key) {
					keys[child.key] = i
			} else {
					free.push(i)
			}
	}

	return {
			keys: keys,     // A hash of key name to index
			free: free      // An array of unkeyed item indices
	}
}