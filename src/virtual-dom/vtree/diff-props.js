export default function diffProps(a, b) {
  let diff

  for (let aKey in a) {
    if (!(aKey in b)) {
      diff = diff || {}
      diff[aKey] = undefined
      continue
    }

    const aValue = a[aKey]
    const bValue = b[aKey]

    if (aValue === bValue) {
      continue
    } else if (isObject(aValue) && isObject(bValue)) {
      // 如果是同一个构造函数的实例
      if (Object.getPrototypeOf(aValue) === Object.getPrototypeOf(bValue)) {
        const objectDiff = diffProps(aValue, bValue)

        if (objectDiff) {
          diff = diff || {}
          diff[aKey] = objectDiff
        }
      } else {
        diff = diff || {}
        diff[aKey] = bValue
      }
    } else {
      diff = diff || {}
      diff[aKey] = bValue
    }
  }

  for (let bKey in b) {
    // 把 b 中新的 prop 添加到 diff 中去
    if (!(bKey in a)) {
      diff = diff || {}
      diff[bKey] = b[bKey]
    }
  }

  return diff
}

function isObject(x) {
	return typeof x === 'object' && x !== null
}