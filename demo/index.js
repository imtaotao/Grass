import Grass from '../src'
import child from './child'

export default class Root extends Grass.Component {
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
    this.setState({arr: [true, 'tt', '3tt'], text: '变化了'})

    setTimeout(() => {
      this.setState({arr: [false, '2t', '3t'], text: 'tt的text'})
    }, 2000);

    this.done(this.state.h).next(this.state.h)
  }

  template () {
    return `
      <div @click="this.c.bind(this)">
        <span v-for="val of arr" v-taotao="val">{{val}}</span>
        <!-- <tt v-for="(val, i) of arr" v-taotao='h' :prop="h"/> -->
      </div>
    `
  }

  component () {
    return {
      tt: child
    }
  }
}