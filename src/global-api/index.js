import use from './plugin'
import mixin from './mixin'
import bindEvent from './event/index'
import createAsync from './async-component'
import CSSModules from './css-modules'
import { customDirective } from './constom-directive'

export default function initGlobalAPI (Grass) {
  Grass.use = use
  Grass.mixin = mixin
  Grass.event = bindEvent
  Grass.async = createAsync
  Grass.CSSModules = CSSModules
  Grass.directive = customDirective
}