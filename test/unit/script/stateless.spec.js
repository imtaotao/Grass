import Grass from '../../../src'
import { componentThrowErr } from '../util'
import { isEmptyObj } from '../../../src/utils'

const Component = Grass.Component

describe('stateless component', () => {
  it('check args', () => {
    class b extends Component {
      beforeCreate () {
        this.state = { a: 1 }
        this.template = '<div><Child :a="a"/></div>'
        this.component = { Child: a }
      }
    }
    function a (props, rigister, parent) {
      expect(Object.keys(props).length).toBe(1)
      expect(props.a).toBe(1)
      expect(typeof rigister).toBe('function')
      expect(typeof parent).toBe('object')
      expect(parent.constructor).toBe(b)
      return '<div></div>'
    }
    b.$mount()
  })

  it('if no props attribute', () => {
    class b extends Component {
      beforeCreate () {
        this.template = '<div><Child /></div>'
        this.component = { Child: a }
      }
    }
    function a (props, rigister, parent) {
      return '<div>{{a}}</div>'
    }
    expect(componentThrowErr(b)).toThrowError('rethrow')
  })

  it('changed props', () => {
    class b extends Component {
      beforeCreate () {
        this.template = '<div><Child /></div>'
        this.component = { Child: a }
      }
    }
    function a (props, rigister, parent) {
      props.a = 1
      return '<div>{{a}}</div>'
    }
    const cm = b.$mount()
    expect(cm.$el.textContent).toBe('1')
  })

  it('update check args', done => {
    let fn
    const obj = { a }
    class b extends Component {
      beforeCreate () {
        this.template = '<div><Child /></div>'
        this.component = { Child: obj.a }
      }
      created () {
        this.forceUpdate()
      }
      didUpdate () {
        expect(obj.a.calls.count()).toBe(2)
        done()
      }
    }
    function a (props, rigister, parent) {
      props.a = 1
      expect(typeof props).toBe('object')
      expect(typeof rigister).toBe('function')
      expect(parent.constructor).toBe(b)
      expect(rigister).not.toBe(fn)
      fn = rigister
      return '<div>{{a}}</div>'
    }
    spyOn(obj, 'a').and.callThrough()
    b.$mount()
    expect(obj.a.calls.count()).toBe(1)
  })

  it('rigister method', () => {
    class a extends Component {
      constructor (props) {
        super(props)
        this.template = '<div>1</div>'
      }
      created () {
        expect(Object.keys(this.props).length).toBe(1)
        expect(this.props.a).toBe(1)
      }
    }
    function b (props, rigister, parent) {
      expect(isEmptyObj(props)).toBeTruthy()
      expect(rigister('Child', a)).toBe(rigister)
      expect(parent).toBeNull()
      return '<div><Child :a="1"/></div>'
    }
    Grass.mount(null, b)
  })
})