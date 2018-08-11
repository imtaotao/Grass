import runExecuteContext from './execution_env'

export default function vevent (node, events, comp, vnodeConf) {
  if (node.isHTMLTag || node.isSvgTag) {
    for (const event of events) {
      const name = event.attrName
      const code = `
        with ($obj_) {
          return ${event.value};
        }
      `
      vnodeConf.attrs['on' + name] = runExecuteContext(code, comp)
    }
  }
}