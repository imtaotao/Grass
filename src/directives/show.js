import runExecuteContext from './execution_env'
import bind from './bind'

export default function show (val, comp, vnodeConf) {
  const code = `with($obj_) { return !!(${val}); }`
  const value = runExecuteContext(code, comp)
    ? ''
    : 'display: none'

  bind({
    attrName: 'style',
    value: value,
  }, comp, vnodeConf)
}