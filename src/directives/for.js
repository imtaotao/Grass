import * as _ from '../utils/index'
import scope from './scope'
import { parseSingleNode } from './index'
import runExecuteContext from './execution-env'

export default function vfor (node, comp, vnodeConf) {
  if (!node.for || !node.forArgs) return

  if (!node.parent) {
    _.sendDirectWarn('v-for', comp.name)
    return
  }

  const cloneNodes = []
  const { key: keys, data, isMultiple } = node.forArgs

  const code = `
    var $data;

    with($obj_) { $data = ${data}; }

    if ($data) {
      $callback_($data);
    }
  `

  function loopData (data) {
    _.each(data, (val, key, i) => {
      if (isMultiple) {
        scope.add(keys[0], val);
        scope.add(keys[1], key);
      } else {
        scope.add(keys, val);
      }

      vforCallback(i)
    })
  }

  function vforCallback (i) {
    const cloneNode = _.vnodeConf(node, vnodeConf.parent)
    const key = vnodeConf.indexKey + '_' + i

    cloneNode.attrs['key'] = key
    cloneNode.indexKey = key

    // 我们要避免无限递归的进入 for 指令
    node.for = false

    cloneNodes[i] = parseSingleNode(node, comp, cloneNode) === false
      ? null
      : cloneNode
  }

  scope.create()
  runExecuteContext(code, 'for', vnodeConf.tagName, comp, loopData)
  scope.destroy()

  const index = serachIndex(vnodeConf)
  replaceWithLoopRes(vnodeConf, cloneNodes, index)
  node.for = true
}

function serachIndex (node) {
  const children = node.parent.children
  const length = children.length
  for (let i = 0; i < length; i++) {
    if (children[i] === node) {
      return i
    }
  }
}

function replaceWithLoopRes (node, res, i) {
  const children = node.parent.children
  children.splice(i, 1, ...res)
}