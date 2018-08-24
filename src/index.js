import { Component, mount } from './component/index'
import initGlobalAPI from './global-api/index'
export * from './global-api/css-modules'

const Grass = {
  Component,
  mount,
}

const prototype = {}

initGlobalAPI(prototype)
Object.setPrototypeOf(Grass, prototype)

export default Grass