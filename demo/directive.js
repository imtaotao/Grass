import Grass from '../src'

export default class Directive extends Grass.Component {
  constructor (props) {
    super(props)
    this.state = {
      a: 121
    }
  }

  c () {
    this.setState({a: 'ttt'})
  }

  template () {
    return `
      <div styleName="directive" @click="this.c.bind(this)">
        {{ a }}
      </div>
    `
  }
}