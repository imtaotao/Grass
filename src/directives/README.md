## 指令
+ `v-on:event (@event)`
+ `v-bind:attr (:attr)`
+ `v-if`
+ `v-show`
+ `v-text`
+ `v-for`
+ `v-transition`

## 修饰符
`v-on` 和 `v-transition` 拥有修饰符的功能
+ `v-on` 拥有 prevet, self, stop 三个修饰符，他们的使用与 vue 的一样，顺序一样是很重要的。至于为什么缺少 once 修饰符，因为现在允许用户手动绑定 bind，导致我们每次得到的都是一个全新的函数，在 diff 的过程中，会重新给添加到 dom 的事件上。除非我们自动帮开发者绑定 this

+ `v-transition` 只有一个修饰符，animate, 这个修饰符用来告诉 Grass，当前动画是 transition 的方式还是 animation 的方式，这样才能保证我们的动画钩子正确的调用

## v-on
`v-on` 指令用于给当前元素绑定事件
```html
  <div v-on:click="this.click"></div>
  或使用别名
  <div @click="this.click"></div>
```

## v-bind
`v-bind` 用来绑定一个属性，它的目的是加强视图与 state 的联系
```html
  <div v-bind:data-a="this.props.xx"></div>
  或使用别名
  <div :data-a="this.props.xx"></div>
```

## v-if
`v-if` 用来决定当前元素是否进行渲染
```html
  <div v-if="true"></div>
```

## v-show
`v-show` 用来决定当前元素是否显示，他主要是通过更改当前元素 css `display` 属性来觉得显示与否
```html
  <div v-show="true"></div>
```

## v-text
`v-text` 用于给当前元素增加一个子文本元素，它不会替换原有的元素，会在第一个元素增加
```html
  <div v-text="'text'"></div>
```

## v-for
`v-for` 用于循环数据结构，方便我们快速的写出可复用的模板，他对 js 的数组和对象都能够遍历
```html
  <div v-for="item of arr"></div>
  或者
  <div v-for="(item, key) of arr"></div>
```

## v-transition
Grass 提供了 `v-transition` 和一个 `animate` 修饰符来做动画效果，动画会在元素或者组件创建销毁时触发，并提供了四个钩子函数
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
`v-transition` 在元素渲染和显示时触发，也就是说他与 `v-if` 和 `v-show` 这两个指令进行关联。在动画的钩子函数中，如果在 enter 函数中（`beforeEnter` 和 `afterEnter`）中 `return false` 会立即终止当前动画

## 指令的优先级
数字越大，优先级越高
```
  v-transtion: 0
  v-text: 1
  v-show: 2
  v-on: 3
  v-bind: 4
  v-if: 5
  v-for: 6
```