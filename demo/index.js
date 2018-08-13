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
      <div @click="this.c.bind(this)" :tt="show">
        <tt v-for="(val, i) of arr" v-show="val" :prop="val"/>
      </div>
    `
  }

  component () {
    return {
      tt: child
    }
  }
}