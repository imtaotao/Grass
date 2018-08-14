import Grass from '../src'

export default class taotao extends Grass.Component {
  constructor (props) {
    super(props, ['height'])
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
        <span> {{a}} </span>
      </div>
    `
  }
}