import {
  mount,
  forceUpdate,
  Component,
} from './component/index'
import initGlobalAPI from './global-api/index'

const Grass = {
  mount,
  Component,
  forceUpdate,
}

const prototype = {}

initGlobalAPI(prototype)

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(Grass, prototype)
} else {
  Grass.__proto__ = prototype
} 

export default Grass