import complierAst from '../directives'
import * as _ from '../utils'

export default function createVnode (comp) {
  ast = complierAst(_.copyNode(comp.catchState.ast))

  return generatorVnode(ast)
}

function generatorVnode (ast, comp) {

}

function createSingleCompVnode (comp, compName) {
  function component () {

  }

  el.prototype.type = 'Widget'
  el.prototype.count = 1
  el.prototype.init = function() {

  }

  el.prototype.update = function(previous, domNode) {
    console.log(previous, domNode);
  }

  el.prototype.destroy = function(domNode) {
    console.log(domNode)
  }

  return new el
}