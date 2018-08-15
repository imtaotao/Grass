## 一个简单的模板编译与 virtual dom，个人学习之用，我把他叫为 Grass
+ 现在还没有想好构造函数怎么弄

### 现在的用法
其实在 [demo](./demo/index.js) 中有写例子
```js
  import Grass from './src'
  import child from 'xx/childComponent'

  class Root extends Grass.Component {
    constructor () {
      super()
      this.state = {
        name: 'test',
        show: true,
      }
    }

    // dom 节点创建之前
    createBefor () {
      // ...
    }

    // dom 节点创建之后
    create (dom) {
      // ...
    }

    // 更新，return false 会阻止更新，现在还没有对 props 做处理，后续要改 
    willUpdate (state, props) {
      // ...
    }

    didUpdate (dom) {
      // ...
    }

    destroy (dom) {
      // ...
    }

    change () {
      // setState 也可以是一个函数，return 一个 state
      this.setState({ show: false })

      setTimeout(() => {
        this.setState({ show: true })
      }, 2000)
    }

    template () {
      return `
        <div>
          <span v-show="show" @click="this.change.bind(this)">{{ name }}<span/>
          <child />
        </div>
      `
    }

    componnet () {
      // 可以 return 一个对象，就像 vue 一样
      // 子组件的名字为类名，也可以手动改名，只要指定一个 name 属性
      /**
       * class Child extends Componnet {
       *  ...
       *  get name () { return 'xxx' }
       *  ...
       * } 
       * */ 
      return [child]
    }
  }

  Grass.mount(document.getElementById('root'), Root)
```

### 定义了几个指令
  + `v-on:event (@event)`
  + `v-bind:attr (:attr)`
  + `v-if`
  + `v-show`
  + `v-text`
  + `v-for`
  + 还可以自定义指令

```js
  // 自定义指令
  Grass.directive('taotao', (compnent, dom, val) => {
    // component 为当前元素所在的组件，所有你可以在此处进行 state 的操作
    // dom 真实的 dom 节点
    // val 指令传入过来的值
    console.log(component, dom, val) // CM, div, 'true'

    dom.onclick = e => {
      component.setState({
        a: !component.state.a,
      })
    }
  })

  class CM extends Grass.Component {
    constructor (props) {
      super(props)
      this.state = {
        a: true,
      }
    }

    template () {
      return '<div v-taotao="a">{{ this.props.a }}</div>'
    }
  }

```
### 组件之间的通信

+ 父级组件可以通过 props 给子组件传递信息
```js
  class Child extends Grass.Component {
    constructor (props) {
      // 可以选择只接受 height prop
      super(props, ['height'])

      this.state = {}
    }

    template () {
      return '<div>{{ this.props.height }}</div>'
    }
  }
```

+ 子组件状态变化通知父组件正在开发中