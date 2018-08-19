import Grass from '../src'

export default class Comp extends Grass.Component {
  constructor () {
    super()
    this.state = {}
  }

  template () {
    return `
      <div className="directive">
        component
      </div>
    `
  }
}