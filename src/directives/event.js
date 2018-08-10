import runExecutContext from './execution_env'

export default function vevent (node, events, compConf, compName) {
  if (node.isHTMLTag || node.isSvgTag) {
    for (const event of events) {
      const name = event.attrName
      const code = `
        with ($obj_) {
          return ${event.value};
        }
      `
      node.attrs['on' + name] = runExecutContext(code, compConf, compName)
    }
  }
}