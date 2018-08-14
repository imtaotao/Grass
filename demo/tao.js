import { Component } from '../src'

export default class taotao extends Component {
  constructor (props) {
    super(props, ['height'])
  }

  c () {
    console.log(this);
  }

  template () {
    return `
      <div @click="this.c.bind(this)">
        {{this.props.height}}
      </div>
    `
  }
}