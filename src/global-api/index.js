import { customDirective } from './constom-directive'
import bindEvent from './event'

export default function (Grass) {
  Grass.directive = customDirective
  Grass.event = bindEvent
}