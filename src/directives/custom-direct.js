import runExecuteContext from './execution-env'

export default function runCustomDirect (val, comp) {
  return runExecuteContext(`
    with ($obj_) {
      return ${val};
    }`, comp)
}