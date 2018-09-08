import Grass, { CSSModules } from '../src'
import style from './style.css'

@CSSModules(style)
class Child extends Grass.Component {
  constructor (props) {
    super(props)
    this.state = {
      current: 'aa'
    }
  }
  create() {
    // console.log('init');
  }
  destroy () {
    // console.log('销毁');
  }

  c () {
    this.props.callback('taotao')
  }

  cr () {
    this.setState({current: 'ff'})
  }

  template () {
    return `
      <p styleName="test-block">
      </p>
    `
  }
}

@CSSModules(style)
class Root extends Grass.Component {
  constructor () {
    super()
    this.state = {
      api: 'index',
      arr: [1, 2],
      show: true,
      obj: {
        tt: 'chentao',
        ff: 'fangfang'
      }
    }
  }

  callback (api) {
    console.log(1);
    // this.setState({arr: [1, 2, 3, 4]})
  }

  beforeEnter () {
    // console.log('beforeEnter');
    this.flag = true
  }

  afterEnter () {
    // console.log('afterEnter');
  }

  beforeLeave () {
    // console.log('beforeLeave');
    // return false
  }

  afterLeave () {
    // console.log('afterLeave');
  }

  template () {
    return `
      <div>
        <div @click="e => this.setState({show: !show})">点击</div>
        <div styleName="test-block">add</div>
        <Child
          v-for="val of arr"
          v-if="show"
          v-transition="'slide-fade'"
          v-beforeEnter="this.beforeEnter"
          v-afterEnter="this.afterEnter.bind(this)"
          v-beforeLeave = "this.beforeLeave.bind(this)"
          v-afterLeave="this.afterLeave.bind(this)"/>
      </div>
    `
  }

  component () {
    return { Child }
  }
}

Grass.directive('tt', (dom, val) => {
  console.log(dom, val);
})

Grass.mount(document.getElementById('root'), Root)