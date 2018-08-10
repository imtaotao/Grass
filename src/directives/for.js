import * as _ from '../utils'
import { parseSingleNode } from './index'
import runExecutContext from './execution_env'
import { TAG } from '../ast/parse_html'

export default function vfor (node, compConf, compName) {
  if (node.for && !node.forArgs) return
  let index = 0
  const children = node.children.splice(0)
  const code = `
    var $isMultiple_ = ${node.forArgs.isMultiple};

    with($obj_) {
      var $container_ = ${node.forArgs.data};

      for (var $index_ = 0; $index_ < $container_.length; $index_++) {
        if ($isMultiple_) {
          $obj_['${node.forArgs.key[0]}'] = $container_[$index_];
          $obj_['${node.forArgs.key[1]}'] = $index_;
        } else {
          $obj_['${node.forArgs.key}'] = $container_[$index_];
        }

        $callback_($index_, $container_.length);
      }
    }
  `

  runExecutContext(code, compConf, compName, (i, length) => {
    for (let j = 0; j < children.length; j++) {
      const newChild = _.copyNode(children[j])
      node.children[index] = newChild

      if (newChild.type === TAG) {
        newChild.attrs.key = index
      }
      parseSingleNode(newChild, compConf)
      index++
    }
  })

  // 绑定用到的 state 属性名
  node.bindState[node.forArgs.data] = true
}