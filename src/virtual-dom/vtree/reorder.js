// const aChildren = [
//   {key: '_1'},
//   {},
//   {},
//   {a: 'taotao'},
//   {key: '_3'},
//   {key: '_5'},
// ]

// const bChildren = [
//   {key: '_3'},
//   {key: '_4'},
//   {},
//   {},
//   {key: '_1'},
//   {key: '_5'},
//   {key: '_6'},
// ]
// reorder(aChildren, bChildren)

export function reorder (aChildren, bChildren) {
  const bChildIndex = keyIndex(bChildren)
  const bKeys = bChildIndex.keys
  const bFree = bChildIndex.free

  if (bFree.length === bChildren.length) {
    return {
      children: bChildren,
      moves: null,
    }
  }

  const aChildIndex = keyIndex(aChildren)
  const aKeys = aChildIndex.keys
  const aFree = aChildIndex.free

  if (aFree.length === aChildren.length) {
    return {
      children: bChildren,
      moves: null,
    }
  }

  const newChildren = []
  const freeCount = bFree.length
  let freeIndex = 0
  let deletedItems = 0

  // 第一步：先按照 a 的循环，把 b 中能与之一一对应的给排序起来
  for (let i = 0, len = aChildren.length; i < len; i++) {
    const aItem = aChildren[i]
    let itemIndex

    if (aItem.key) {
        if (bKeys.hasOwnProperty(aItem.key)) {
          itemIndex = bKeys[aItem.key]
          newChildren.push(bChildren[itemIndex])
        } else {
          // 我们添加个 null 代表此处在后续是要给删除的
          deletedItems++
          newChildren.push(null)
        }
    } else {
      // 找到 bChildren 的 free 元素，一一对应添加
      if (freeIndex < freeCount) {
        itemIndex = bFree[freeIndex++]
        newChildren.push(bChildren[itemIndex])
      } else {
        // 如果 a 中的 free 比 b 中的 free 多，多的我们删掉
        deletedItems++
        newChildren.push(null)
      }
    }
  }

  // 第二步：我们对剩下的 bChildren 中的 item 进行处理（例如例子中的 {key: '_6'} 到这里还没有放到 newChildren 中）
  // 用 >= 是因为 freeIndex++ 了，比如 bFree: [0: xx]，而 freeIndex -> 1
  const lastFreeIndex = freeIndex >= bFree.length ? bChildren.length : bFree[freeIndex]

  for (let j = 0, len = bChildren.length; j < len; j++) {
    const newItem = bChildren[j]

    if (newItem.key) {
      // 如果 aKeys 中没有找到，代表是新建的 item
      if (!aKeys.hasOwnProperty(newItem.key)) {
        newChildren.push(newItem)
      }
    } else {
      // 有可能在上一次循环，b 中的 free 元素没有被取干净，那么此时 j 是有可能 >= lastFreeIndex 的
      if (j >= lastFreeIndex) {
        newChildren.push(newItem)
      }
    }
  }

  // 此时我们已经把 b 按照 a 的顺序排列好了，这样 a 就可以与排好序的 b 进行 diff 了
  // 但是现在的 b 与原来的 b 是有顺序区别的，我们要记录下这种移动顺序，在真实节点中去移动
  // 第三步：记录节点的移动

  const simulate = newChildren.slice()
  const removes = []
  const inserts = []
  let simulateIndex = 0
  let simulateItem

  // simulate 是 aChildren 和 bChildren 的集合，所以 bChildren 中有的 simulate 中一定存在这个元素
  // 而 aChildren 中多余的我们都改为了 null，会过滤掉，所以最后的结果中，removes 中存在的的元素，inserts 中一定存在
  // 反过来，removes 中可能存在 key 为 null 的情况
  for (let k = 0, len = bChildren.length; k < len;) {
    const wantedItem = bChildren[k]
    simulateItem = simulate[simulateIndex]

    // 如果 simulateItem 为 null，代表是原先 a 中需要删除的元素（有点像 promise 那个拿最底层的 promise 实例哈）
    while (simulateItem === null && simulate.length) {
      // key 为 null 代表 b 中没有与 a 对应的元素，是要直接删掉的
      removes.push(remove(simulate, simulateIndex, null))
      simulateItem = simulate[simulateIndex]
    }

    if (simulateItem && simulateItem.key === wantedItem.key) {
      // 如果重新排序后的 simulate 还是在原来的位置，就没必要记录差异
      k++
      simulateIndex++
    } else {
      if (wantedItem.key) {
        if (simulateItem && simulateItem.key) {
          const positionInBkeys = bKeys[simulateItem.key]

          if (positionInBkeys === k + 1) {
            // 如果 positionInBkeys === k + 1 代表这个 simulateItem 应该是在当前这个 wantedItem 后面的
            // 是应该出现的位置
            inserts.push({key: wantedItem.key, to: k})
          } else {
            // 如果这里不是应该出现的位置，而 simulateItem.key 也不等于 wantedItem.key，那么代表这个位置应该是
            // 移动到一个不相邻的距离，我们让他消失，并记录这个 item 的位置
            removes.push(remove(simulate, simulateIndex, simulateItem.key))
            simulateItem = simulate[simulateIndex]

            // 我们现在拿到下一个元素，如果相等，那么 simulateItem 就是在正常的位置，调到下一次循环
            if (simulateItem && simulateItem.key === wantedItem.key) {
              simulateIndex++
            } else {
              // 如果不相等，我们就把 wantedItem 插入到 k 这个位置（以 bChildren 的位置位置，所以按照 wantedItem 的顺序走肯定没错）
              inserts.push({key: wantedItem.key, to: k})
            }
          }
        } else {
          // 代表此时的 simulateItem 是 free 元素，一直加（复位）
          inserts.push({key: wantedItem.key, to: k})
        }
        k++
      } else if (simulateItem && simulateItem.key) {
        // 代表此时的 wantedItem 是 free 元素，simulateItem 有 key，位置肯定不对，一直删（移动）
        removes.push(remove(simulate, simulateIndex, simulateItem.key))
      }
    }
  }

  /**
   *  我们总结下，只要新旧俩节点 key 不等，那么分为以下两种情况处理
   *  1. 如果是相邻俩节点的位移，我们只要把 后面的一个元素 插入 到前面即可（positionInBkeys === k + 1）
   *  2. 如果不是相邻的位移的节点，那么代表是多距离位移，我们直接把当前的元素 remove（这个 item 瞬移开始😁）
   *     然后我们对比删除后的 simulate 集合的最前面一个元素，如果和当前 wantedItem key 是相等的，那么
   *     现在的顺序是对的，跳过，如果不等，我们直接插入 wantedItem（我们以新的 children 顺序为准），此时的
   *     wantedItem 就是正确的位置，就放在这里，如果有 remove 掉的元素找到了此时的 wantedItem，那就是移动
   *     否则，这个 wantedItem 就是新增的
   *
   *  那么还存在没有 wantedItem 和 没有 simulateItem 的情况
   *  1. wantedItem 没有 key，那么此时 wantedItem 肯定不相等 simulateItem(相等已过滤)，而且 wantedItem 肯定是 free 元素
   *     那么把 simulateItem 如果有 key，那肯定不算 free 元素，那位置肯定不对，就要 remove（瞬移），知道找到相等的为止
   *     （肯定有，应为我们在上一次循环中，把新旧节点的都放到 newChildren 中了，只不过去重了）然后我们再对 bChildren 中剩下的，
   *     继续进行循环，进行判断，最终 insert 里面的，其实这些就是那些瞬移的节点，只不过，这里可能少了，如果少了的，那就是真删了，
   *     如果多了的，那就是真的新增的，如果找到了瞬移对应的节点，那就是真的移动了。
   *
   *  2. simulateItem 没有 key，那就是 free 元素，(想想 wantedItem 没有 key，开始了 free 元素的 move)，这里就是要
   *     开始 free 元素的 insert (复位)，此处一直 insert wantedItem, 直到找到相等的为止，然后继续判断
   *
   *  3. 如果 simulateItem 没有，那有可能是我们再 remove 的时候给删没了（想想 wantedItem 没有 key 的 时候），我们只要
   *     把当前的 wantedItem 插入到 insert 数组中
   *
   *  可以看到针对 wantedItem 和 simulateItem 为 free 元素的时候，一个使劲删，一个使劲加，知道找到相等的为止，因为没有 key
   *  也不用管 key 对不对了，只要按照新的 item 顺序排列就好了
   * */

  // 删除 simulate 中多余的元素，也就是残留的旧节点，因为我们把 bChildren 的节点都处理过，剩下的都是不需要的
  // 这里的 simulateIndex 是相同属性的节点计数，每次计数的时候，simulate 都会过掉一个元素，所以只要一般
  // 情况下都是想相等的，除非 simulate 有多余的节点
  while(simulateIndex < simulate.length) {
    simulateItem = simulate[simulateIndex]
    removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
  }

  // 全部都是删除，没有插入（就是没有移动与新增）
  if (removes.length === deletedItems && !inserts.length) {
    return {
      children: newChildren,
      moves: null,
    }
  }

  return {
    children: newChildren,
    moves: {
      removes: removes,
      inserts: inserts,
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
      keys: keys,
      free: free,
  }
}