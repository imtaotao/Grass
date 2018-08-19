export function addCache (parentComp, compName, comp, i) {
  const childs = parentComp.$cacheState.childComponent[compName]
  if (!childs) {
    parentComp.$cacheState.childComponent[compName] = []
  }

  // 第一次进入的时候 i 可能并不为 0
  parentComp.$cacheState.childComponent[compName][i] = comp
}

export function removeCache (parentComp, compName, comp) {
  const childs = parentComp.$cacheState.childComponent[compName]
  if (childs) {
    for (let i = 0, len = childs.length; i < len; i++) {
      const child = childs[i]
      if (child === comp) {
        childs[i] = null
      }
    }
  }
}

export function getCache (parentComp, compName, i) {
  const childs = parentComp.$cacheState.childComponent[compName]
  if (childs && childs[i]){
    return childs[i]
  }

  return null
}