## 全局 api
+ Component
+ mount
+ directive
+ CSSModules
+ async
+ event
+ mixin
+ use

## Component
`Component` 用于创建 class 形式的组件
```js
 class P extends Grass.Component {}
```

## mount
`mount` 方法与组件构造函数的 `$mount` 方法一样，用于挂载组件，返回组件实例
```js
class P extends Grass.Component {}
const p = Grass.mount(dom, P)
```
或者用于无状态组件
```js
const p = Grass.mount(dom, () => '<div></div>')
```

## directive
这个方法用来注册自定义的指令。自定义指令的优先级低于内置指令
```js
const P = () => '<div v-tao="1"></div>'
Grass.directive('tao', (dom, val, vnode) => {
  // dom -> div
  // val -> 1
})
```

## CSSModules
Grass 提供了 一个 CSSModules api，用于配合 css-loader 做 css 的模块化，你可以使用 styleName 和 className 做区分，
需要注意的是，styleName 会在模板解析时进行转换，所以不能使用 `v-bind:styleName='xx'`（后续可能修复）
```js
  import style from './style.css'

  @Grass.CSSModules(style)
  class P extends Grass.Component {
    template () {
      return '<div styleName="xx"></div>'
    }
  }
  
```

## async
`async` 用于注册一个异步组件，他接受一个函数，这个函数返回一个异步组件或者一个含有异步组件的配置 object

直接返回一个异步组件
```js
  class P extends Grass.Component {
    template () {
      return '<div styleName="xx"></div>'
    }
    component () {
      return {
        Child: Grass.async(() => import('../child'))
        // Child: Grass.async((resolve, reject) => setTimeout(() => {
        // resovle(child)
        // })
      }
    }
  }
```
返回带异步组件的配置
```js
class P extends Grass.Component {
    template () {
      return '<div styleName="xx"></div>'
    }
    component () {
      return {
        Child: Grass.async(() => ({
          component: import('../child'),
          timeout: 100,
          delay: 0,
          loading: () => '<div>loading</div>',
          error: () => '<div>error</div>',
        }))
      }
    }
  }
```

如果想要获取异步组件的构造函数，可以通过当前组件实例的 `getComponent` 方法

## event
用于改变组件为可观测组件，但是不能是无状态组件
```js
  Grass.event(Compnent)
```
此方法会为组件构造函数添加三个方法 `on`、 `done`、 `error` <br/>
此方法也会为组件实例添加三个方法 `next`、 `done`、 `error`

+ `on` 用于对组件注册监听函数，对于组件实例的 `next`
+ `done` 监听 done 事件，对于组件实例的 `done`
+ `error` 监听 error 事件，对于组件实例的 `error`

需要注意的是组件一旦出发 `done` 或 `error` 事件，就再也不会触发事件了<br/>
可能你会在一个组件内触发不同的事件，所以你需要标记 type 进行区分，event 提供了俩工具函数来帮助你做这些，`listener`与`tNext`
```js
  class P extends Component {
    created () {
      this.tNext('tt', 1)
    }
  }

  P.listener('tt', val => {
    ...
  })

  P.$mount()
```


## mixin
mixin 可以对组件混入一些方法和属性，它有两种用法
+ 对所有组件进行混入
```js
  // 如果只传入一个参数会对所有的组件进行混入
  Grass.mixin({
    a: () => {}
  })
```
+ 对单一组件进行混入
```js
  // 此时只会对 component 这个组件进行混入
  Grass.mixin(component, {
    a: () => {}
  })
```

## use
`use` 方法用来使用插件，他接受一个函数，或者带有 `init` 方法的对象。Grass 会作为第一个参数传入
```js
  Grass.use((grass, ...args) => {
    // ...
  })

  // or
  const obj = {
    init (grass, ...args) {
      // ...
    }
  }

  Grass.use(obj, 1, 2)
```