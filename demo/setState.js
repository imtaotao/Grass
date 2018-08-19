import Grass from '../src'

export default class SetState extends Grass.Component {
  constructor () {
    super()
    this.state = {}
  }

  template () {
    return `
      <div className="set-state">
        setState
      </div>
    `
  }
}