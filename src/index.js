import { Component, mount } from './component/index'
import initGlobalAPI from './global-api/index'

const Grass = {
  Component,
  mount,
}

const prototype = {}

initGlobalAPI(prototype)
Object.setPrototypeOf(Grass, prototype)

export default Grass