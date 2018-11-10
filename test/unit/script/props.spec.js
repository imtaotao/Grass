import Grass from '../../../src'

const Component = Grass.Component

describe('Props', () => {
  it('props is normal', done => {
    class a extends Component {
      constructor (props) {
        super(props)
        expect(Object.keys(props).length).toBe(6)
        expect(Object.keys(this.props).length).toBe(3)
        expect(this.props.a).toBe(1)
        expect(this.props.b).toBe(2)
        expect(this.props.c).toBe('3')
        expect(this.props.slot).toBeUndefined()
        expect(this.props.className).toBeUndefined()
        expect(this.props.styleName).toBeUndefined()
      }
      template () {
        return '<div>{{this.props.a}}{{this.props.b}}{{this.props.c}}</div>'
      }
    }
    (class b extends Component {
      constructor () {
        super()
        this.state = { a: 1, b: 2 }
        this.component = { Child: a }
        setTimeout(() => {
          this.setState({ a: 2 })
        })
      }
      created () {
        expect(this.$el.textContent).toBe('123')
      }
      didUpdate () {
        expect(this.$el.textContent).toBe('223')
        done()
      }
      template () {
        return (`
          <div>
            <Child :a="a" :b="b" c="3" className="c" styleName="b" slot="d" />
          </div>
        `)
      }
    }).$mount()
  })

  it('defined props require list', () => {
    class a extends Component {
      constructor (props) {
        super(props, ['a'])
        expect(Object.keys(props).length).toBe(3)
        expect(Object.keys(this.props).length).toBe(1)
        expect(this.props.a).toBe(1)
        expect(this.props.b).toBeUndefined()
        expect(this.props.c).toBeUndefined()
      }
      template () {
        return '<div></div>'
      }
    }
    (class b extends Component {
      constructor () {
        super()
        this.state = { a: 1, b: 2 }
        this.component = { Child: a }
      }
      template () {
        return (`
          <div>
            <Child :a="a" :b="b" c="3"/>
          </div>
        `)
      }
    }).$mount()
  })

  it('Multi-layer component props', done => {
    multiPropsTest(done)
  })

  it('Multi-layer component props, response mode', done => {
    multiPropsTest(done, true)
  })
})

function multiPropsTest (done, mode) {
  let i = 0
  const a = () => '<div>{{this.props.a}}</div>'
  class b extends Component {
    constructor (props) {
      super(props)
      this.component = { Child: a }
    }
    created () {
      expect(this.$el.textContent).toBe('1')
      expect(Object.keys(this.$children).length).toBe(1)
      expect(typeof this.$children.Child).toBe('object')
    }
    didUpdate () {
      expect(this.$el.textContent).toBe('2')
      expect(i).toBe(0)
      i++
    }
    template () {
      return (`
        <div>
          <Child :a="this.props.a"/>
        </div>
      `)
    }
  }
  class c extends Component {
    constructor (props) {
      super(props)
      this.component = { Child: b }
    }
    created () {
      expect(this.$el.textContent).toBe('1')
      expect(Object.keys(this.$children).length).toBe(1)
      expect(typeof this.$children.Child).toBe('object')
    }
    didUpdate () {
      expect(this.$el.textContent).toBe('2')
      expect(i).toBe(1)
      i++
    }
    template () {
      return (`
        <div>
          <Child :a="this.props.a"/>
        </div>
      `)
    }
  }
  class d extends Component {
    constructor () {
      super()
      if (mode) {
        this.createResponseState({ a: 1})
      } else {
        this.state = { a: 1 }
      }
      this.component = { Child: c }
      setTimeout(() => {
        if (mode) {
          this.state.a = 2
        } else {
          this.setState({ a: 2 })
        }
      })
    }
    created () {
      expect(this.$el.textContent).toBe('1')
      expect(Object.keys(this.$children).length).toBe(1)
      expect(typeof this.$children.Child).toBe('object')
    }
    didUpdate () {
      expect(this.$el.textContent).toBe('2')
      expect(i).toBe(2)
      done()
    }
    template () {
      return (`
        <div>
          <Child :a="a"/>
        </div>
      `)
    }
  }
  const cm = d.$mount()
  expect(cm.$el.textContent).toBe('1')
}