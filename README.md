## 一个简单的模板库，底层使用 virtual-dom，个人学习之用，我把他叫为 Grass

### 如何使用
在 [demo](./demo/root/index.grs) 中有例子
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

    // 将要更新组件
    willUpdate () {
      // ...
    }

    // 父组件更新，当前子组件也要，接受父组件传递的 props，return false 可以阻止当前子组件更新
    willReceiveProps (props) {

    }

    // 更新完成
    didUpdate (dom) {
      // ...
    }

    // 当前组件销毁前
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
  + `v-transition`
  + `v-animation`
  + 还可以自定义指令

```js
  // 自定义指令
  Grass.directive('taotao', (dom, val) => {
    // dom 真实的 dom 节点
    // val 指令传入过来的值
    console.log(dom, val) // div, 'true'
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
  Grass.directive('tao', (dom, val) => {
    // ...
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
用于创建一个干净的 state，所以要么用对象字面量创建一个 state 或者是用此方法，它能让 state 的原型是干净的，同时会丢弃原有的原型链
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
将要更新 dom 树时，允许对组件的 state 一次进行调整
```js
  class C extends Grass.Component {
    willUpdate () {
      if (this.state.xx = xxx) {
        this.state.xx = xxxx
      }
    }
  }
```

#### willReceiveProps
接受父组件传递的 props，return false 可以阻止当前子组件更新，用于优化
```js
  class C extends Grass.Component {
    willReceiveProps (props) {
      if (props.xx = xxx) {
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

### 动画
Grass 提供了 `v-transition` 和 `v-animation` 来做动画，动画会在元素或者组件创建销毁时触发，并提供了四个钩子函数, 所有
+ `v-beforeEnter`
+ `v-afterEnter`
+ `v-beforeLeave`
+ `v-afterLeave`
  
```css
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
```

```html
  <template>
    <div
    v-if="show"
    v-transition="'slide-fade'"
    v-beforeEnter="this.beforeEnter.bind(this)"
    v-afterEnter="this.afterEnter.bind(this)"
    v-beforeLeave = "this.beforeLeave.bind(this)"
    v-afterLeave="this.afterLeave.bind(this)"></div>
  </template>

  <script>
    import Grass, { CSSModules } from 'grass'
    import style from './style.css'

    @CSSModules(style)
    class C extends Grass.Component {
      constructor () {
        super()
      }

      beforeEnter (dom) {
        // ...
      }

      afterEnter (dom) {
        // ...
      }

      beforeLeave (dom) {
        // ...
      }

      afterLeave (dom) {
        // ...
      }
    }
  </script>
```

### CSSModules
Grass 提供了 一个 CSSModules api，用于配合 css-loader 做 css 的模块化
```js
  import Grass, { CSSModules } from 'grass'
  import style from './style.css'

  @CSSModules(style)
  class C extends Grass.Component {
    constructor () {
      super()
    }

    template () {
      return '<div styleName="xx"></div>'
    }
  }
```
### 与 [grass-loader](https://github.com/imtaotao/grass-loader) 一起使用
grass-loader 会预编译模板，所以你可以像 vue 一样使用单文件组件，不同的是，这个单文件组件并不包含 css
```html
<template>
  <div styleName="xx">{{ tao }}</div>'
</template>

<script>
  import { CSSModules } from 'grass'
  import style from './style.css'

  @CSSModules(style)
  class C extends Grass.Component {
    constructor () {
      super()
      this.state = {
        tao: 'chentao',
      }
    }
  }
</script>
```
对于无状态组件，应该只包含一个 `<template><template/>`，无状态模板有两个配置项可供选择
  + name 属性是这个无状态组件的组件名
  + styleSrc 属性为这个无状态组件的需要的 css，如果设置了此属性，会自动开启 css module（需要 css-loader 配合）

```
  <template name="noState" styleSrc="./style.css">
    <div styleName="xx">{{ tao }}</div>'
  <template/>
```

### 逻辑图
```html


```

### 注意事项
报错信息显示的组件名称，是根据组件的声明名字进行关联的，所以注重的地方是组件创建时的 name。欢迎大家提 bug 啊，一起学习。前端小分队 qq 群：624921236