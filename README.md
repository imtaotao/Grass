## 一个简单的模板编译与 virtual dom，个人学习之用，我把他叫为 Grass
+ 现在还没有设计构造函数怎么弄

### 现在的用法
```js
  import Component from './src'
  import child from 'xx/childComponent'

  class Root extends Component {
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
    willUpdate (state) {
      // ...
    }

    didUpdate (dom) {
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
          <span v-show="show" @click="change.bind(this)">{{ name }}<span/>
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
```

### 定义了几个指令
  + `v-on:event (@event)`
  + `v-bind:attr (:attr)`
  + `v-if`
  + `v-show`
  + `v-text`
  + `v-for`（好像写错了，现在只对当前元素的所有子元素进行复制😓）

但是，妈个蛋的还有很多问题，很方