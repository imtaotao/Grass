import { Component, mount } from './component/index'
import initGlobalAPI from './global-api/index'
export * from './global-api/css-modules'

const Grass = {
  mount,
  Component,
}

const prototype = {}

initGlobalAPI(prototype)
Object.setPrototypeOf(Grass, prototype)

export default Grass