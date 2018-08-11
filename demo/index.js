import Component from '../src'
import child from './child'

export default class Root extends Component {
  constructor () {
    super()
    this.state = {
      root: '我是 root 组件',
      arr: [1, 2, 3]
    }
  }

  template () {
    return `
      <div>
        {{ root }}
        <div v-for="val of arr">
          <child />
        </div>
      </div>
    `
  }

  component () {
    return [child]
  }
}