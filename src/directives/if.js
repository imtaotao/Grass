import runExecutContext from './execution_env'

export default function vif (val, comp) {
  const code = `
    with(_obj_) {
      return !!(${val});
    }
  `
  return runExecutContext(code, comp)
}