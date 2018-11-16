## 组件的定义方式
组件一共分为两种，一种通过 class 语法定义一个类，为有状态的组件，另外一种为无状态组件，直接通过函数来定义，返回一段模板。

+ class 组件
通过继承 Grass.Component
```js
  class P extend Grass.Component {
    constructor (props) {
      super(props)
    }
    template () {
      return (`<div></div>`)
    }
  }
  P.$mount(document.getElementById('xx'))
```

+ 无状态组件
```js
  function P (props, register, parent) {
    return (`<div></div>`)
  }
  Grass.mount(document.getElementById('xx'), P)
```

## template
class 组件必须有一个 template 属性或方法，如果为一个方法，它应该返回一段模板代码，否则会抛出一个错误。模板代码应该只能有一个根元素

## component
component 属性或方法用来注册子组件，它应该为一个对象或返回一个对象

## 生命周期
生命周期的回调只能在 class 形式的组件中使用
+ beforeCreate
此时组件刚刚实例化完成，此时的还未对组件进行 mount，所以，在这里可以定义组件的 `state`、`component`、`template` 等属性，但是所有此时组件内部的属性都为初始值，例如 `$parent`、`$children` 等

+ created
在组件 mount 之后，会调用此方法，此时所有的组件内部属性值已经与组件树联系起来，此函数接受一个参数，为 mount 后的真实 dom 元素

+ willUpdate
在组件将要更新的时候调用，此函数接受一个参数，为当前组件真实的 dom 元素，与组件的 `$el` 属性一致。`this.$el === dom`

+ willReceiveProps
在子组件将要更新的时候，会调用此函数，它将在 `willUpdate` 之前调用，这个函数接受一个新的 props 参数。这个函数的主要是用来优化组件，避免不必要的渲染，`return false` 可以阻止当前组件的更新

+ didUpdate
在组件更新完成后调用，此函数接受一个参数，为当前组件真实的 dom 元素

+ destroy
在组件即将销毁的时候调用，此函数接受一个参数，为当前组件真实的 dom 元素。在此函数中可以对组件的一些事件绑定等进行解绑，避免内存的泄露


生命周期顺序
```
  +------------------+
  |   beforeCreate   |
  +------------------+
          |
          v
  +------------------+
  |     created      |
  +------------------+
          |
          v
  +------------------+
  | willReceiveProps |
  +------------------+
          |
          v
  +------------------+
  |    willUpdate    |
  +------------------+
          |
          v
  +------------------+
  |     didUpdate    |
  +------------------+
          |
          v
  +------------------+
  |     destroy      |
  +------------------+
```

## 构造函数 api
+ $mount
在 class 组件下，`$mount` 这个 api 能够把当前组件挂载到一个真实的 dom 上，它是 `Grass.mount` 的别名
```js
  class P extends Grass.Component {
    beforeCreate () {
      this.template = '<div></div>'
    }
  }
  P.$mount(dom)
// Grass.mount(dom, P)
```

## 实例属性（只能在 class 组件中使用）
+ createState
+ createResponseState
+ setState
+ forceUpdate
+ getComponent
+ set（响应模式下）
+ delete（响应模式下）

### createState
`createState` 能够创建一个纯碎的 state，他会丢弃 state 的原有原型链。（对于 state，很重要的一点是，我们需要一个感觉的state，也就是原型链必须为 `Object.prototype` 或者 `null`，否则会出现一些其他的问题）
```js
  class P extends Grass.Component {
    beforeCreate () {
      const state = Object.create({ a: 1})
      state.b = 2
      this.createState(state)
      // state.a === undefined
    }
  }
```

### createResponseState
`createResponseState` 能够创建一个响应式的 state，同样的，他会丢弃 state 原有的原型链

### setState
在非响应式的模式下（通过 $isWatch 查看当前组件的模式)，可以通过 `setState` 来更改状态，更新视图，在响应式模式下，此方法会给出一个报错。状态的更改不会立即响应到视图，也不能立即得到更改的状态。它有两种使用方式，一种为传入 state，一种为回调函数形式，在回调函数中，你能够拿到最新的 state，这个回调需要返回一个 state
```js
  class P extends Grass.Component {
    created () {
      this.setState({ a: 1 })
      console.log(state.a) // undefined
      setTimeout(() => console.log(state.a)) // 1
    }
  }
```
回调函数的使用
```js
  class P extends Grass.Component {
    created () {
      this.setState({ a: 1 })
      this.setState(state => {
        console.log(state.a) // 1
        return state
      })
    }
  }
```

### forceUpdate
这个方法会强制更新当前组件一次

### getComponent
获取当前组件注册的子组件，如果注册的子组件为异步组件，你可能没有办法直接拿到子组件的构造函数，所以可以通过此方法来获取，它接受一个为 string 类型的参数，为子组件的注册名字
```js
  class P extends Grass.Component {
    beforeCreate () {
      this.component = {
        Child: Grass.async(() => {
          ...
        })
      }
    }
    created () {
      this.getComponent('Child')
    }
  }
```

### set 与 delete
在响应模式下，由于没有办法监视到 object 属性的增加和删除，所有你可以通过这个俩方法来新增和删除 object 的属性，并保证新加入的属性也是响应模式的。需要注意，在响应模式下才会有这两个方法

## 内部属性
+ state
组件的 state

+ props
父组件传入的 props，它是响应式的，父组件更新，子组件所用到的 props 也会同步更新，当然，可以通过 `willReceiveProps` 来阻止更新

+ $el
组件 mount 后的真实 dom 元素

+ $slot
当前组件的 slot

+ $parent
当前组件的所在的父组件实例

+ $children
当前组件注册的子组件实例，通过 ref 来指定需要获取的子组件。需要注意的是，如果子组件是异步组件的形式，因为所以没有办法控制组件具体加载的时间，所以你可以在异步组件的钩子里面获取当前组件的子组件实例。
```js
const one = () => '<div></div>'

class two extends Grass.Component {
  component () {
    return { one }
  }
  template () {
    return `<div><one ref="child"/></div>`
  }
  created () {
    console.log(this.$children.child) // one instance
  }
}
```

+ $isWatch
当前组件在哪种模式下

## slot
我们可以使用 slot 内置组件来进行一些插槽行为
+ 父组件
```html
<template>
  <child>
    <div slot="tao">{{api}}</div>
    <bb slot='fang'></bb>
  </child>
</template>
```

+ 子组件
```html
<template>
  <slot name="tao"></slot>
  <slot name="fang"></slot>
  <slot></slot>
</template>
```
我们可以指定 name 属性来选取需要插入的插槽，当没有 name 属性的时候，会把所有内容都插入进来，而且我们还可在组件内通过 `$slot` 属性来拿到所有的插槽内容的 `vnode`，插槽的内容都是在所定义的组件之内编译的，这是需要注意的一点

## 响应式模式
```html
<template>
  <div styleName="xx" @click="this.click.bind(this)">{{ tao }}</div>'
</template>

<script>
  import { CSSModules } from 'grass'
  import style from './style.css'

  @CSSModules(style)
  class P extends Grass.Component {
    constructor () {
      super()
      this.createResponseState({
        tao: 'taotao',
      })
    }
    click () {
      this.state.tao = 'tao'
    }
  }
</script>
```
响应数据模式和普通模式，最好不要混用

<br/>
<br/>

# 无状态组件
+ props
+ register
+ parent

使用方法
```js
  function p (props, register, parent) {
    return '<div></div>'
  }
```

### props
`props` 与 class 组件形式的 `this.props` 一样，都是父组件传下来的，不同的是，在无状态组件中，我们在模板中不需要使用 `this.props.xx`，在无状态组件中，`props` 与 class 组件的 `state` 一样，可以简写

class 组件
```js
  class P extends Grass.Component {
    constructor () {
      this.state = { a : 1 }
      // this.props = { b: 2 }
    }
    template () {
      return '<div>{{ a }} {{ this.props.b }}</div>'
    }
  }
```
无状态组件
```js
  function p (props) {
    // props -> { b : 2 }
    return `<div>{{ b }}</div>`
  }
```

当前，在无状态组件中，你可以对 `props` 进行更改，由于是引用模式，`props` 所有的更改都将映射到真实的视图中
```js
  function click (e) {
    ...
  }
  function p (props) {
    props.c = click
    return `<div @click="c"></div>`
  }
```

### register
`register` 可以让当前无状态组件注册子组件，不然在无状态组件中，你无法使用子组件，这是个很大的问题，也真是这个方法出现的原因。它接收一个参数或俩参数，返回函数自身
```js
  function one () {
    return '<div>child</div>'
  }
  function two (props, register, parent) {
    register('Child', one)
    // 如果只传入组件，那么组件的 constructor name 将作为组件的名字
    // register(one)
    return '<div><Child/></div>'
  }
```

### parent
`parent` 对应着 class 组件中的 `this.$parent` 属性