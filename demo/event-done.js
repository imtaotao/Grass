import Grass from '../src'

export default class EventDone extends Grass.Component {
  constructor () {
    super()
    this.state = {}
  }

  template () {
    return `
      <div className="event-done">
        eventdone
      </div>
    `
  }
}