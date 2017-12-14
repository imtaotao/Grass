import * as _ from './util'

export function listDiff (oldList = [], newList = [], key) {
	const oldMap   = makeKeyIndex(oldList, key)
  const newMap   = makeKeyIndex(newList, key)
  const oldIndex = oldMap.keyIndex
  const newIndex = newMap.keyIndex
  const newFree  = newMap.free
  let moves      = []

  // a simulate list
  let children   = []
  let freeIndex  = 0
 	
  // Check old list item, is delete or not
  _.each(oldList, (item, i) => {
  	const itemKey = getKey(item, key)
  	if (itemKey) {
  		// get now key's position in newIndex
  		const position = newIndex[itemKey]
  		if (!position) {
  			return children.push(null)
  		}
  		children.push(newList[position])
  	}
  })

  // deep copy children array
  const simulateList = children.slice(0)
  
  // remove not exist item
  _.each(simulateList, (vnode, i) => {
  	if (vnode === null) {
  		remove(i)
  		removeSimulate(i)
  	}
  })

  let j = 0
  _.each(newList, (vnode, i) => {
  	const itemKey = getKey(vnode, key)
  	const simulateItem = simulateList[j]
  	const simulateKey  = getKey(simulateItem, key)

  	_.log(itemKey, simulateKey)
  	if (simulateItem) {
  		// _.log(itemKey, simulateItem)
  		// If key is same, noting to do
  		if (itemKey === simulateKey) {
  			j++
  			return
  		} 
			if (!oldIndex[itemKey]) {
				insert(i, item)
			}

			
  		

  		

  		return
  	}

  	insert(i, vnode)
  })
	


  function removeSimulate (index) {
  	simulateList.splice(index, 1)
	}

	function remove (index) {
		moves.push({index, type: 0})
	}

	function insert (index, item) {
		moves.push({
			index,
			item,
			type: 1
		})
	}
}

function makeKeyIndex (list, key) {
	const keyIndex = Object.create(null)
	const free = []
	_.each(list, (item, i) => {
		// get detail key
		const itemKey = getKey(item, key)
		// save every key correspond index
		itemKey ? keyIndex[itemKey] = i : free.push(item)
	})

	return {keyIndex, free}
}

function getKey (item, key) {
	return _.isString(key) 
		? item[key]
		: key(item)
}