import bindEvent from './event/index'
import createAsync from './async-component'
import { CSSModules } from './css-modules'
import { customDirective } from './constom-directive'

export default function (Grass) {
  Grass.event = bindEvent
  Grass.async = createAsync
  Grass.CSSModules = CSSModules
  Grass.directive = customDirective
}