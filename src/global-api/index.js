import use from './plugin'
import mixin from './mixin'
import version from '../version'
import share from './share-component'
import bindEvent from './event/index'
import CSSModules from './css-modules'
import { setOnlyReadAttr } from '../utils'
import createAsync from './async-component'

import { customDirective } from './custom-directive'

export default function initGlobalAPI (Grass) {
  Grass.use = use
  Grass.share = share
  Grass.mixin = mixin
  Grass.event = bindEvent
  Grass.async = createAsync
  Grass.CSSModules = CSSModules
  Grass.directive = customDirective

  setOnlyReadAttr(Grass, 'version', version)
}