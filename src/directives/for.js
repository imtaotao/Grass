import * as _ from '../utils'
import { parseSingleNode } from '.'
import runExecutContext from './execution_env'
import { TAG } from '../ast/parse_template'

export default function vfor (node, comp) {
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

  runExecutContext(code, comp, (i, length) => {
    for (let j = 0; j < children.length; j++) {
      const newChild = _.copyNode(children[j])
      node.children[index] = newChild

      if (newChild.type === TAG) {
        newChild.attrs.key = index
      }

      // 此处是回调是在创建的允许时环境里面允许的
      // 所以此时继续编译如果报错，报错信息会叠加
      // 等于是一个 for 就叠加一层
      parseSingleNode(newChild, comp)
      index++
    }
  })

  // 绑定用到的 state 属性名
  node.bindState[node.forArgs.data] = true
}