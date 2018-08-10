import runExecutContext from './execution_env'
import bind from './bind'

export default function show (node, val, comp) {
  const code = `
    with($obj_) {
      return !!(${val});
    }
  `

  const value = runExecutContext(code, comp)
    ? ''
    : 'display: none'

  bind(node, {
    attrName: 'style',
    value: value,
  }, comp)
}