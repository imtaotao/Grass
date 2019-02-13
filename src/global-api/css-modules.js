import * as _ from '../utils/index'

export default function CSSModules (styles) {
  return component => {
    if (component && !_.isEmptyObj(styles)) {
      component.$styles = styles
    }
    return component
  }
}