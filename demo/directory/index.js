import Grass, { CSSModules } from '../../src'
import style from './style.css'

@CSSModules(style)
class Dir extends Grass.Component {
  constructor (props) {
    super(props)
    console.log(this.props);
    this.state = {
      apiList: [
        ['Component', 'mount', 'directive', 'event'],
        ['setState', 'createState'],
        ['next', 'done', 'error'],
      ],
      titleList: ['全局', '实例', 'Event'],
      currentApi: 'directive',
    }
  }

  togglePage (api) {
    this.next(api)
    this.setState({currentApi: api})
  }

  template () {
    return `
      <div>
          <div v-for="(list, i) of apiList">
            <p styleName="title">{{ titleList[i] }} api</p>
            <ul styleName="list-box">
              <li
                @click="this.togglePage.bind(this, api)"
                v-for="api of list"
                :styleName="'api-name ' + (api === currentApi ? 'active' : '')">{{ api }}</li>
            </ul>
          </div>
      </div>
    `
  }

  component () {
    return [SingeApiList]
  }
}

export default Grass.event(Dir)