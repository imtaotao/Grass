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
      text: 'tt的text'
    }
  }

  c () {
    this.setState({arr: [true, '2t', '3t'], text: '变化了'})

    setTimeout(() => {
      this.setState({arr: [false, '2t', '3t'], text: 'tt的text'})
    }, 2000);
  }

  template () {
    return `
      <div @click="this.c.bind(this)">
        {{arr[0]}}
        <tt v-for="(val, i) of arr" v-if="val" v-text="text" :prop="val"/>
      </div>
    `
  }

  component () {
    return {
      tt: child
    }
  }
}