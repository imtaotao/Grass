import { customDirective } from './constom-directive'
import bindEvent from './event/index'

export default function (Grass) {
  Grass.directive = customDirective
  Grass.event = bindEvent
}