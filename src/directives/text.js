import runExecuteContext from './execution-env'
import * as _ from '../utils'

export default function text (val, comp, vnodeConf) {
  const code = `with($obj_) { return ${val}; }`
  const content = runExecuteContext(code, 'text', vnodeConf.tagName, comp)

  if (_.isReservedTag(vnodeConf.tagName)) {
    // 但是既然用了 v-text 就不应该继续添加子元素了
    // 从语义上讲，我们认为这个标签是一个 text 标签
    // 但是为了保证代码的逻辑，我们还是需要做下处理
    // 此时的 children 还只是个 []， 所以我们把 text 放在第一个
    vnodeConf.children = [_.vText(content, vnodeConf)]
  } else {
    vnodeConf.vTextResult = content
  }
}