import runExecutContext from './execution_env'
import bind from './bind'

export default function show (node, val, compConf, compName) {
  const code = `
    with($obj_) {
      return !!(${val});
    }
  `

  const value = runExecutContext(code, compConf, compName)
    ? ''
    : 'display: none'

  bind(node, {
    attrName: 'style',
    value: value,
  }, compConf, compName)
}