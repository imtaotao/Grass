import runExecuteContext from './execution-env'

export default function runCustomDirect (key, tagName, val, component) {
  return runExecuteContext(`
    with ($obj_) {
      return ${val};
    }`,
    key.slice(2, key.length),
    tagName,
    component
  )
}