import * as _ from '../utils/index'

export default class Container {
  constructor (val) {
    this._value = val
  }

  pipe (fun) {
    return Container.of(fun(this._value))
  }

  safePipe (fun) {
    return _.isUndef(this._value)
      ? Container.of(null)
      : Container.of(fun(this._value))
  }

  maybe (fun) {
    return fun
      ? fun(this._value)
      : this._value
  }

  static
  of (val) {
    return new Container(val)
  }
}