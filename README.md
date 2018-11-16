## 一个简单的 mvvm 库

## [如何使用](https://github.com/imtaotao/Grass/tree/master/demo/root/index.grs)

## [全局API](./src/global-api)

## [组件实例](./src/component)

## [模板指令](./src/directives)

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
  class P extends Grass.Component {
    constructor () {
      super()
      this.state = {
        tao: 'chentao',
      }
    }
  }
</script>
```
对于无状态组件，应该只包含一个 `<template></template>`，无状态模板有两个配置项可供选择
  + name 属性是这个无状态组件的组件名
  + styleSrc 属性为这个无状态组件的需要的 css，如果设置了此属性，会自动开启 css module（需要 css-loader 配合）

```html
  <template name="noState" styleSrc="./style.css">
    <div styleName="xx">{{ tao }}</div>'
  </template>
```
<br/>

报错信息显示的组件名称，是根据组件的声明名字进行关联的，所以注重的地方是组件创建时的 name。欢迎大家提 bug 啊，一起学习。前端小分队 qq 群：624921236