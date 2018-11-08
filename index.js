// import './demo'
// import './dev'
import Grass from './src'

class b extends Grass.Component {
  createBefore () {
    this.state = {
      data: {
        arr: [1, 2],
        obj: {
          one: 3,
          two: 4,
          three: [5, 6]
        }
      },
    }
  }
  template () {
    return (`
      <div>
        <div v-for="val of data">
          {{val.toString()}}
          <span v-for="(val, key) of val">
            {{val}}
            <a v-for="val of val">{{val}}</a>
          </span>
        </div>
      </div>
    `)
  }
}

window.s = b.mount()
// console.log(b.mount(s));