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
  const { data, key, isMultiple } = node.forArgs

  const code = `
    with($obj_) {
      for (var $index_ = 0; $index_ < ${data}.length; $index_++) {
        if (${isMultiple}) {
          $scope_.add('${key[0]}', ${data}[$index_]);
          $scope_.add('${key[1]}', $index_);
        } else {
          $scope_.add('${key}', ${data}[$index_]);
        }

        $callback_($index_);
      }
    }
  `
  function vforCallback (i) {
    const cloneNode = _.vnodeConf(node, vnodeConf.parent)
    cloneNode.attrs['key'] = i

    // 我们要避免无限递归的进入 for 指令
    node.for = false

    cloneNodes[i] = parseSingleNode(node, comp, cloneNode) === false
        ? null
        : cloneNode
  }

  scope.create()
  runExecuteContext(code, 'for', vnodeConf.tagName, comp, vforCallback)
  scope.destroy()

  const index = serachIndex(vnodeConf)
  replaceWithLoopRes(vnodeConf, cloneNodes, index)
  node.for = true
}

function serachIndex (node) {
  const children = node.parent.children
  const length = children.length
  for (let i = 0; i < length; i++) {
    if (children[i] === node)
      return i
  }
}

function replaceWithLoopRes (node, res, i) {
  const children = node.parent.children
  children.splice(i, 1, ...res)
}