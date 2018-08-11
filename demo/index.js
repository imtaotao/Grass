import Component from '../src'
// import child from './child'

export default class Root extends Component {
  constructor () {
    super()
    this.state = {
      root: '我是 root 组件',
      arr: ['1t', '2t', '3t'],
      h: 20
    }
  }

  c () {

  }

  template () {
    return `
      <div v-for="val of arr">
        <span v-if="true">{{ val }}</span>
      </div>
    `
  }

  component () {
    // return [child]
  }
}