import Grass from '../src'
import taotao from './tao'

export default class child extends Grass.Component {
  constructor (props) {
    super(props, ['prop'])
    this.state = {
      show: true,
      name: '我是 child 组件',
      dt: '测试自定义属性',
    }
  }

  destroy(dom) {
    // console.log(dom);
  }

  isShow (e) {
    this.setState({name: false})

    setTimeout(() => {
      this.setState({name: '我是 child 组件'})
    }, 2000)
  }

  template () {
    return `
      <div @click="this.isShow.bind(this)" aa="11" :bb="22" :data-test="dt" :attributes="{ id: 121 }">
        {{ name }} -- {{this.props.prop}}
        <taotao :txt='dt'/>
      </div>
    `
  }

  component () { return [taotao] }
}