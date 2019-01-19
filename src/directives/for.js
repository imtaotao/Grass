import * as _ from '../utils/index'
import scope from './scope'
import Watcher from '../observer/Watcher'
import { createVnodeConf } from './util'
import { parseSingleNode } from './index'
import runExecuteContext from './execution-env'

export default function vfor (node, component, vnodeConf) {
  if (!node.for || !node.forArgs) return

  if (!node.parent) {
    _.sendDirectWarn('v-for', component.name)
    return
  }

  const cloneNodes = []
  const watcherCollectList = {}
  const { key: keys, data, isMultiple } = node.forArgs

  const code = `
    var $data;

    with($obj_) { $data = ${data}; }

    if ($data) {
      $callback_($data);
    }

    return $data;
  `

  function loopData (data) {
    if (Array.isArray(data)) {
      for (let i = 0, len = data.length; i < len; i++) {
        const nodeKey = vnodeConf.indexKey + '_' + i
        addValue(isMultiple, data[i], i, i, nodeKey)
      }
    } else if (_.isObject(data)) {
      const dataKey = Object.keys(data)
      for (let i = 0, len = dataKey.length; i < len; i++) {
        const key = dataKey[i]
        const nodeKey = vnodeConf.indexKey + '_' + i
        const val = getValue(component, () => data[key], node, nodeKey)

        addValue(isMultiple, val, key, i, nodeKey)
      }
    } else {
      throw Error(`Data must be a "array" or "object", but now is "${typeof data}: ${data}"`)
    }
  }

  function addValue (isMultiple, val, key, i, nodeKey) {
    if (isMultiple) {
      scope.add(keys[0], val);
      scope.add(keys[1], key);
    } else {
      scope.add(keys, val);
    }

    vforCallback(i, nodeKey)
  }

  function vforCallback (i, key) {
    const cloneNode = createVnodeConf(node, vnodeConf.parent)

    cloneNode.attrs['key'] = key
    cloneNode.indexKey = key

    // 我们要避免无限递归的进入 for 指令
    node.for = false
    
    cloneNodes[i] = parseSingleNode(node, component, cloneNode) === false
      ? null
      : cloneNode

    // 在 for 指令里面我们要记录当前节点是否已经收集依赖，因为有可能会有新成员的增加
    if (component.$isWatch) {
      watcherCollectList[key] = true
    }
  }

  scope.create()
  runExecuteContext(code, 'for', vnodeConf, component, loopData)
  scope.destroy()

  // 我们只记录 copy 节点的编译
  if (node.for === false) {
    node.watcherCollectList = watcherCollectList
  }

  const index = serachIndex(vnodeConf)
  replaceWithLoopRes(vnodeConf, cloneNodes, index)
  node.for = true
}

function serachIndex (node) {
  let index = node.parent.children.indexOf(node)
  return index > -1 ? index : undefined
}

function replaceWithLoopRes (node, res, i) {
  const children = node.parent.children
  children.splice(i, 1, ...res)
}

function getValue (component, fun, astNode, nodeKey) {
  if (!component.$isWatch) {
    return fun()
  } else {
    // 避免重复的依赖收集，我们只对新添加的进行收集, 尽管在 dep 里面也有判断，但是此时判断能少创建 watcher
    if (astNode.watcherCollectList[nodeKey]) {
      return fun()
    } else {
      let value
      new Watcher(nodeKey, component, () => {
        return value = fun()
      }, component.forceUpdate)
      return value
    }
  }
}