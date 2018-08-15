export default class Container {
  constructor (val) {
    this._value = val
  }

  isUndef () {
    return this._value === undefined || this._value === null
  }

  map (fun) {
    return this.isUndef()
      ? Container.of(null)
      : Container.of(fun(this._value))
  }

  static
  of (val) {
    return new Container(val)
  }
}