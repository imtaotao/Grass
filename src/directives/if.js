import runExecutContext from './execution_env'

export default function vif (val, compConf, compName) {
  const code = `
    with(_obj_) {
      return !!(${val});
    }
  `
  return runExecutContext(code, compConf, compName)
}