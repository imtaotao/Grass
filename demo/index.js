import Component from '../src'
import child from './child'

export default class Root extends Component {
  constructor () {
    super()
    this.state = {
      root: '我是 root 组件',
      arr: [false, '2t', '3t'],
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
      <div @click="this.c.bind(this)" :tt="show" v-text="h">
        11
        <tt v-for="val of arr" v-text="h" test="121" :height="val" v-show="val"/>
      </div>
    `
  }

  component () {
    return {
      tt: child
    }
  }
}