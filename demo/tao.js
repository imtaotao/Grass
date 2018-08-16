import Grass from '../src'

export default class taotao extends Grass.Component {
  constructor (props) {
    super(props, ['txt'])
    this.state = {
      a: 1,
    }
  }

  c () {
    console.log(this);
  }

  template () {
    return `
      <div @click="this.c.bind(this)">
        <span> {{a}} {{this.props.txt}} </span>
      </div>
    `
  }
}