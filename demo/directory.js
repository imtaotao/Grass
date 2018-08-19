import Grass from '../src'

class Dir extends Grass.Component {
  constructor (props) {
    super(props)
    this.state = {
      apiList: [
        ['Component', 'mount', 'directive', 'event'],
        ['setState', 'createState'],
        ['next', 'done', 'error'],
      ],
      titleList: ['全局', '实例', 'Event'],
    }
  }

  togglePage (api) {
    this.next(api)
  }

  template () {
    return `
      <div>
          <div v-for="(list, i) of apiList">
            <p className="title">{{ titleList[i] }} api</p>
            <ul className="list-box">
              <li
                @click="this.togglePage.bind(this, api)"
                v-for="api of list"
                :className="'api-name ' + (api === this.props.currentApi ? 'active' : '')">{{ api }}</li>
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