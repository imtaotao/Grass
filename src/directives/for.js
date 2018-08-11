import * as _ from '../utils'
import { parseSingleNode } from '.'
import runExecuteContext from './execution_env'
import { TAG } from '../ast/parse_template'

export default function vfor (node, comp, vnodeConf) {
  if (node.for && !node.forArgs) return
  
  let index = 0
  const children = node.children
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

        $callback_($index_, $container_.length);
      }
    }
  `

  runExecuteContext(code, comp, (i, length) => {
    for (let j = 0; j < children.length; j++) {
      const child = _.vnodeConf(children[j], vnodeConf)
      vnodeConf.children[index] = child

      if (child.type === TAG) {
        child.attrs.key = index
      }

      // 此处是回调是在创建的允许时环境里面允许的
      // 所以此时继续编译如果报错，报错信息会叠加
      // 等于是一个 for 就叠加一层
      parseSingleNode(children[j], comp, child)
      index++
    }
  })
}