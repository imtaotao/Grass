import Grass from '../../../src'
import { isEmptyObj } from '../../../src/utils'

const Component = Grass.Component

describe('Life cycle', () => {
  it('beforeCreate', () => {
    class p extends Component {
      beforeCreate (arg) {
        expect(isEmptyObj(this.state)).toBeTruthy()
        this.state = { a: 1 }
        expect(arg).toBeUndefined()
      }
      template () {
        return '<div></div>'
      }
    }
    const cm = p.mount()
    expect(cm.state.a).toBe(1)
  })

  it('created', () => {
    const a = () => '<div></div>';
    (class b extends Component {
      beforeCreate () {
        this.state = { a: 1 }
      }
      created (dom) {
        expect(dom.textContent).toBe('a')
        expect(this.state.a).toBe(1)
        expect(this.$el).toBe(dom)
        expect(this.$parent).toBeNull()
        expect(this.$slot).toBeNull()
        expect(this.$children.Child.constructor).toBe(a)
        expect(Object.keys(this.$children).length).toBe(1)
        expect(isEmptyObj(this.props)).toBeTruthy()
      }
      template () {
        return '<div>a<Child/></div>'
      }
      component () {
        return { Child: a }
      }
    }).mount()
  })

  it('willUpdate', done => {
    class p extends Component {
      constructor () {
        super()
        this.state = { a: 1 }
        setTimeout(() => {
          this.setState({a: 2})
        })
      }
      willUpdate (dom) {
        expect(dom).toBe(this.$el)
        expect(dom.textContent).toBe('1')
        setTimeout(() => {
          expect(this.$el.textContent).toBe('2')
          done()
        })
      }
      template () {
        return '<div>{{a}}</div>'
      }
    }
    expect(p.mount().$el.textContent).toBe('1')
  })

  it('willReceiveProps', done => {
    class a extends Component {
      constructor (props) {
        super(props)
        expect(props.a).toBe(1)
      }
      willReceiveProps (newProps) {
        expect(newProps.a).toBe(2)
        expect(this.$el.textContent).toBe('1')
        setTimeout(() => {
          expect(this.$el.textContent).toBe('2')
          expect(this.props.a).toBe(2)
          done()
        })
      }
      template () {
        return '<div>{{this.props.a}}</div>'
      }
    }
    class b extends Component {
      constructor () {
        super()
        this.state = { a: 1 }
        this.component = { Child: a }
        setTimeout(() => {
          this.setState({ a: 2 })
        })
      }
      template () {
        return '<div><Child :a="a"/></div>'
      }
    }
    expect(b.mount().$el.textContent).toBe('1')
  })

  it('if willReceiveProps method return false', done => {
    class a extends Component {
      constructor (props) {
        super(props)
        expect(props.a).toBe(1)
      }
      willReceiveProps (newProps) {
        expect(newProps.a).toBe(2)
        expect(this.$el.textContent).toBe('1')
        setTimeout(() => {
          expect(this.$el.textContent).toBe('1')
          expect(this.props.a).toBe(1)
          done()
        })
        return false
      }
      template () {
        return '<div>{{this.props.a}}</div>'
      }
    }
    class b extends Component {
      constructor () {
        super()
        this.state = { a: 1 }
        this.component = { Child: a }
        setTimeout(() => {
          this.setState({ a: 2 })
        })
      }
      template () {
        return '<div><Child :a="a"/></div>'
      }
    }
    expect(b.mount().$el.textContent).toBe('1')
  })

  it('didUpdate', done => {
    (class p extends Component {
      beforeCreate () {
        this.state = { a: 1 }
        setTimeout(() => {
          this.setState({ a: 2 })
        })
      }
      willUpdate (dom) {
        expect(this.state.a).toBe(2)
        expect(dom.textContent).toBe('1')
      }
      didUpdate (dom) {
        expect(this.state.a).toBe(2)
        expect(dom.textContent).toBe('2')
        done()
      }
      template () {
        return '<div>{{a}}</div>'
      }
    }).mount()
  })

  it('destroy', done => {
    class a extends Component {
      destroy (dom) {
        expect(dom.textContent).toBe('1')
        setTimeout(() => {
          expect(this.$isDestroyed).toBeTruthy()
          done()
        })
      }
      template () {
        return '<div>{{this.props.a}}</div>'
      }
    }
    (class b extends Component {
      constructor () {
        super()
        this.state = { a: 1, show: true }
        this.component = { Child: a }
        setTimeout(() => {
          this.setState({ show: false })
        })
      }
      template () {
        return '<div><Child v-if="show" :a="a"/></div>'
      }
    }).mount()
  })

  it('life cycle order', done => {
    let i = 0
    class a extends Component {
      beforeCreate () {
        expect(i).toBe(0)
        i++
      }
      created () {
        expect(i).toBe(1)
        i++
      }
      willReceiveProps () {
        expect(i).toBe(2)
        i++
      }
      willUpdate () {
        expect(i).toBe(3)
        i++
      }
      didUpdate () {
        expect(i).toBe(4)
        i++
      }
      destroy () {
        expect(i).toBe(5)
        done()
      }
      template () {
        return '<div>{{this.props.a}}</div>'
      }
    }
    (class b extends Component {
      constructor () {
        super()
        this.state = { a: 1, show: true }
        this.component = { Child: a }
        setTimeout(() => {
          this.setState({ a: 2 })
          setTimeout(() => this.setState({ show: false }))
        })
      }
      template () {
        return '<div><Child v-if="show" :a="a"/></div>'
      }
    }).mount()
  })
})