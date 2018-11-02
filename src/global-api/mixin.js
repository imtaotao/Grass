import * as _ from '../utils/index'

export default function mixin (component, mixin) {
  if (component) {
    if (!mixin) {
      mixin = component
      component = null
    }

    if (_.isObject(mixin)) {
      const proto = component
        ? component.prototype
        : this.Component.prototype
      
      _.extend(proto, mixin)
    }
  }

  return this
}