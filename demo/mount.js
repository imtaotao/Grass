import Grass from '../src'

export default class Mount extends Grass.Component {
  constructor () {
    super()
    this.state = {}
  }

  template () {
    return `
      <div className="directive">
        mount
      </div>
    `
  }
}