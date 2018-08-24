import Grass from '../src'

export default class Event extends Grass.Component {
  constructor () {
    super()
    this.state = {}
  }

  template () {
    return `
      <div styleName="event">
        event
      </div>
    `
  }
}