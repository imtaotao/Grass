import * as _ from '../utils/index'
import { Component } from '../component/index'

export default function mixin (component, mixin) {
  if (component) {
    if (!mixin) {
      mixin = component
      component = null
    }

    const originComponent = this
      ? this.Component
      : Component

    if (_.isObject(mixin)) {
      const proto = component
        ? component.prototype
        : originComponent.prototype
      
      _.extend(proto, mixin)
    }
  }

  return this
}