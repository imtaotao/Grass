import runExecuteContext from './execution_env'

export default function vif (val, comp) {
  const code = `
    with($obj_) {
      return !!(${val});
    }
  `
  return runExecuteContext(code, comp)
}