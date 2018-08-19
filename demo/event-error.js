import Grass from '../src'

export default class EventError extends Grass.Component {
  constructor () {
    super()
    this.state = {}
  }

  template () {
    return `
      <div className="event-error">
        eventerror
      </div>
    `
  }
}