import { Component, mount } from './component/index'
import initGlobalAPI from './global-api/index'
export * from './global-api/css-modules'

const Grass = {
  mount,
  Component,
}

const prototype = {}

initGlobalAPI(prototype)

// "setPrototypeOf" is a undefined in PhantomJs.
if (Object.setPrototypeOf) {
  Object.setPrototypeOf(Grass, prototype)
} else {
  Grass.__proto__ = prototype
} 

export default Grass