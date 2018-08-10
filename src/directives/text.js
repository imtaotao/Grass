import runExecutContext from './execution_env'
import { _createStaticNode } from '../ast/parse_template'

export default function text (node, val, comp) {
  const code = `
    with(_obj_) {
      return ${val};
    }
  `
  const content = runExecutContext(code, comp)
  node.children.unshift(_createStaticNode(content, node))
}