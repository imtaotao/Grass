import * as _ from '../utils'
import { parseSingleNode, complierChildrenNode } from './index'
import runExecuteContext from './execution_env'

export default function vfor (node, comp, vnodeConf) {
  if (!node.for || !node.forArgs) return
  if (!node.parent) {
    _.sendDirectWarn('v-for', comp.name)
    return
  }

  const cloneNodes = []
  const args = node.forArgs
  const code = `
    var $isMultiple_ = ${args.isMultiple};

    with($obj_) {
      var $container_ = ${args.data};
      for (var $index_ = 0; $index_ < $container_.length; $index_++) {
        if ($isMultiple_) {
          $obj_['${args.key[0]}'] = $container_[$index_];
          $obj_['${args.key[1]}'] = $index_;
        } else {
          $obj_['${args.key}'] = $container_[$index_];
        }

        $callback_($index_);
      }
    }
  `

  runExecuteContext(code, comp, (i) => {
    const cloneNode = _.vnodeConf(node, vnodeConf.parent)
    cloneNode.attrs['key'] = i

    // 我们要避免无限递归的进入 for 指令
    node.for = false

    cloneNodes[i] = parseSingleNode(node, comp, cloneNode) === false
        ? null
        : cloneNode
  })

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