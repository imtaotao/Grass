import Component from '../src'
import child from './child'

export default class Root extends Component {
  constructor () {
    super()
    this.state = {
      root: '我是 root 组件',
      arr: ['1t', '2t'],
      h: 20,
      show: true,
    }
  }

  c () {
    this.setState({show: false, h: 25})

    setTimeout(() => {
      this.setState({show: true, h: 30})
    }, 2000);
  }

  template () {
    return `
      <div @click="this.c.bind(this)" :tt="show">
        11
        <tt v-for="val of arr" v-text="h" test="121" :height="h"/>
      </div>
    `
  }

  component () {
    return {
      tt: child
    }
  }
}