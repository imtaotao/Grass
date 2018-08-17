import Grass from '../src'

class C extends Grass.Component {
  constructor () {
    super()
  }

  template () {
    return '<div>{{a.b}} - {{n}}</div>'
  }
}

Grass.mount(root, C)