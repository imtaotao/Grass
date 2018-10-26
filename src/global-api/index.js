import { customDirective } from './constom-directive'
import bindEvent from './event/index'
import async from './async-component'

export default function (Grass) {
  Grass.directive = customDirective
  Grass.event = bindEvent
  Grass.async = async
}