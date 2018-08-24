import Grass from '../src'

class Child extends Grass.Component {
  constructor (props) {
    super(props)
    this.state = {
      current: 'aa'
    }
  }
  create() {
    console.log('init');
  }
  destroy () {
    console.log('销毁');
  }

  c () {
    this.props.callback('taotao')
  }

  cr () {
    this.setState({current: 'ff'})
  }

  template () {
    return `
      <div>
        <div @click="this.c.bind(this)">
          121
        </div>
        <div @click="this.cr.bind(this)">
          {{ current }}
        </div>
      </div>
    `
  }
}


class Root extends Grass.Component {
  constructor () {
    super()
    this.state = {
      api: 'index',
      arr: [1, 2],
      obj: {
        tt: 'chentao',
        ff: 'fangfang'
      }
    }
  }

  callback (api) {
    this.setState({arr: [1, 2, 3]})
  }

  template () {
    return `
      <div>
        <div @click="() => this.setState({arr: [1, 2, 3, 4]})">tttt</div>
        <Child v-for="val of obj" :callback="this.callback.bind(this)"/>
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