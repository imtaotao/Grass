import Grass from '../src'

export default class CreateState extends Grass.Component {
  constructor () {
    super()
    this.state = {}
  }

  template () {
    return `
      <div className="create-state">
        createState
      </div>
    `
  }
}