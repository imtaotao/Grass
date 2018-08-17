## 一个简单的模板库，底层使用 virtual-dom，个人学习之用，我把他叫为 Grass

### 如何使用
在 [demo](./demo/index.js) 中有例子
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

  class Parent extends Grass.component {
    constructor (props) {
      super(props)
      this.state = {
        h: '20px',
      }
    }

    template () {
      return '<div><Child :height="h" /></div>'
    }

    component () {
      return [Child]
    }
  }
```

+ 子组件与父组件直接的通信和兄弟组件直接的通信（observer）
```js
  // 我们定义了一个 api --> event
  // 它可以让我们把一个组件变成一个可观测的组件
  class One extends Grass.Component {
    constructor (props) {
      super(props)

      this
      .next(1)
      .next(2)
      .done('done')
    }
  }

  // event 方法会在 One 这个组件上注册一些观测者的方法
  Grass.event(One)

  class Two extends Grass.Component {
    constructor (props) {
      super(props)

      One
      .on(On)
      .done(val => {
        // ...
      })
      .error(err => {
        // ...
      })
    }

    destroy (dom) {
      // 我们在当前组件销毁的时候可以注销掉对 One 这个组件的监听
      // 防止内存泄露
      One.remove(On)
    }

    On (val) {
      // ...
    }
  }
```

### 无状态组件
我们可以定义无状态组件，但是有个限制是，最好不要对无状态组件的 prototype 进行修改，我们要保证是一个纯净的组件
```js
export function comp (props) {
  // props => { a: 1 }
  // 我们不需要手写 props.a，此时的语法与状态组件的 state 一样
  return '<div>{{ a }}</div>'
}
```
但是没有办法把无状态组件变成一个可观测的组件

```js
export function comp (props) {
  return '<div></div>'
}

Grass.event(comp) // error
```

### 全局 API
#### Grass.Component
用于创建一个有状态的组件

#### Grass.mount
用于把根组件挂载到指定的元素上
```js
  Grass.mount(document.getElementById('root'), Root)
```

#### Grass.directive
用于注册自定义指令
```js
  Grass.directive('tao', (compnent, dom, val) => {

  })
```

#### Grass.event
用于改变组件为可观测组件，但是不能是无状态组件
```js
  Grass.event(Compnent)
```
此方法会为组件构造函数添加三个方法 `on`、 `done`、 `error` <br/>
此方法也会为组件实例添加三个方法 `next`、 `done`、 `error`
+ `on` 用于对组件注册监听函数，对于组件实例的 `next`
+ `done` 监听 done 事件，对于组件实例的 `done`
+ `error` 监听 error 事件，对于组件实例的 `error`

需要注意的是组件一旦出发 `done` 或 `error` 事件，就再也不会触发事件了

### 组件实例 API
#### setState
用于改变组件状态，同时跟新组件 dom 树
```js
  this.setState({})

  // 或者
  this.setState(state => {
    state.xx = xx
    return state
  })
```

#### createState
用于创建一个感觉的 state，所以要么用对象字面量创建一个 state 或者是用此方法，它能让 state 的原型是干净的，同时会丢弃原有的原型链
```js
  this.state = this.createState({xxx: xxx})
```

### 钩子函数
#### createBefore
在组件模板编译之前调用，此时你可以对 state 进行一些调整
```js
class C extends Grass.Component {
  createBefore () {
    // this.state = xxx
  }
}
```

#### create
dom 元素创建后调用，它接受一个渲染完毕的 dom 元素作为参数
```js
class C extends Grass.Component {
  create (dom) {
    // ...
  }
}
```

#### willUpdate
将要更新 dom 树时，运行对 state 组件一次进行调整，如果此钩子函数返回 `false`，将会阻止跟新，它接受 state 和 props 作为参数
```js
class C extends Grass.Component {
  willUpdate (state, props) {
    if (state.xx = xxx) {
      return false
    }
  }
}
```

#### didUpdate
dom 跟新完毕后调用
```js
class C extends Grass.Component {
  didUpdate (dom) {
    // ...
  }
}
```

#### destroy
当前组件被销毁时调用，可以对组件的一些绑定进行解绑，例如在此组件中对另一个组件进行着观测，此时就可以解除观测，避免内存泄露
```js
class C extends Grass.Component {
  destroy (dom) {
    // ...
  }
}
```

### 注意事项
报错信息显示的组件名称，是根据组件的声明名字进行关联的，所以注重的地方是组件创建时的 name。欢迎大家提 bug 啊，一起学习<br/>
前端小分队 qq 群：624921236