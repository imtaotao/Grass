import Grass from '../src'

export default class EventNext extends Grass.Component {
  constructor () {
    super()
    this.state = {}
  }

  template () {
    return `
      <div className="event-next">
        eventnext
      </div>
    `
  }
}