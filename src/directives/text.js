import runExecuteContext from './execution_env'
import { vText } from '../utils'

export default function text (val, comp, vnodeConf) {
  const code = `with($obj_) { return ${val}; }`
  const content = runExecuteContext(code, comp)

  // 我们只能用 push 添加到最后一个，因为如果放在前面可能会被替换掉
  vnodeConf.children.push(vText(content, vnodeConf))
}