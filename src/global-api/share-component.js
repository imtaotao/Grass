import * as _ from '../utils'
import { getProps } from '../component/index'

export default function share (fn, defaultProps = {}, needFilter) {
  const options = Object.create(null)
  const component = this.mount(window.root, fn)

  if(_.isObject(defaultProps) && !_.isEmptyObj(defaultProps)) {
    component.props = !needFilter
      ? defaultProps
      : getProps(defaultProps)
    component.forceUpdate()
  }

  options.fn = fn
  options.share = true
  options.component = component

  window.s = component
  return options
}