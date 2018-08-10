import runExecutContext from './execution_env'
import { _createStaticNode } from '../ast/parse_html'

export default function text (node, val, compConf, compName) {
  const code = `
    with(_obj_) {
      return ${val};
    }
  `
  const content = runExecutContext(code, compConf, compName)
  node.children.unshift(_createStaticNode(content, node))
}