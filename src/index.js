import { Component, mount } from './component'
import initGlobalAPI from './global-api'

const Grass = {
  Component,
  mount,
}

const prototype = {}

initGlobalAPI(prototype)
Object.setPrototypeOf(Grass, prototype)

export default Grass