import Grass from '../src'

export default class EventDone extends Grass.Component {
  constructor () {
    super()
    this.state = {}
  }

  template () {
    return `
      <div styleName="event-done">
        eventdone
      </div>
    `
  }
}