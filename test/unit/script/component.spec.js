import Grass from '../../../src'
import * as _ from '../../../src/utils'
import { throwComponent } from '../util'
import { isWidget, isVNode } from '../../../src/virtual-dom/vnode/typeof-vnode'

const Component = Grass.Component

describe('Component', () => {
  it('missing template function, can\'t create component', () => {
    class p extends Component {}
    expect(throwComponent(p)).toThrowError('rethrow')
  })

  it('template no return string', () => {
    class a extends Component {
      template () {}
    }
    const b = () => {}
    expect(throwComponent(a)).toThrowError('rethrow')
    expect(throwComponent(b)).toThrowError('rethrow')
  })

  it('ability to create components', () => {
    class p extends Component {
      template () {
        return '<div></div>'
      }
    }
    const cm = p.mount()
    expect(typeof cm).toBe('object')
    expect(isWidget(cm.$widgetVNode)).toBeTruthy()
  })

  it('ability to create no state component', () => {
    const p = () => '<div>1</div>'
    const cm = Grass.mount(null, p)
    expect(typeof cm).toBe('object')
    expect(cm.$el.textContent).toBe('1')
    expect(isWidget(cm.$widgetVNode)).toBeTruthy()
  })

  it('vnode container is normal', () => {
    class p extends Component {
      template () {
        return '<div>a</div>'
      }
    }
    const cm = p.mount()
    expect(isVNode(cm.$widgetVNode.container.vtree)).toBeTruthy()
    expect(cm.$widgetVNode.container.dom.textContent).toBe('a')
  })

  it('state、props, and $el is normal', () => {
    class p extends Component {
      template () {
        return '<div>a</div>'
      }
    }
    const cm = p.mount()
    expect(!cm).toBeFalsy()
    expect(cm.state && _.isEmptyObj(cm.state)).toBeTruthy()
    expect(cm.props && _.isEmptyObj(cm.props)).toBeTruthy()
    expect(cm.$el.textContent).toBe('a')
  })

  it('parent and child components nested successfully', () => {
    class a extends Component {
      template () {
        return '<a>child</a>'
      }
    } 
    class b extends Component {
      constructor () {
        super()
      }
      template () {
        return (
          `<div>
            parent <Child :t="1"/>
          </div>`)
      }
      component () {
        return { Child: a }
      }
    }
    const acm = a.mount()
    const bcm = b.mount()
    expect(acm.$el.textContent).toBe('child')
    expect(_.isEmptyObj(acm.$children)).toBeTruthy()
    expect(acm.$parent).toBeNull()
    expect(bcm.$el.textContent.trim()).toBe('parent child')
    expect(bcm.$children.Child).toBeDefined()
    expect(bcm.$parent).toBeNull()
    expect(bcm.$children.Child.$parent).toBe(bcm)
    expect(bcm.$children.Child.props.t).toBe(1)
  })

  it('CSSModules and styleName are normal', () => {
    const style = { a: 'b' }
    class p extends Component {
      template () {
        return '<div styleName="a"></div>'
      }
    }
    const cm = Grass.CSSModules(style)(p).mount()
    const ast = cm.constructor.$ast
    const vnode = cm.$widgetVNode.container.vtree
    expect(ast.attrs.styleName).toBe('a')
    expect(vnode.properties.className).toBe('b')
  })

  it('no state component use CSSModules', () => {
    const style = { a: 'b' }
    const compClass = Grass.CSSModules(style)(
      () => '<div styleName="a"></div>'
    )
    const comp = Grass.mount(null, compClass)
    const ast = comp.constructor.$ast
    const vnode = comp.$widgetVNode.container.vtree
    expect(ast.attrs.styleName).toBe('a')
    expect(vnode.properties.className).toBe('b')
  })

  it('styleName is not available without the CSSModules method', () => {
    class p extends Component {
      template () {
        return '<div styleName="a"></div>'
      }
    }
    const cm = p.mount()
    const ast = cm.constructor.$ast
    const vnode = cm.$widgetVNode.container.vtree
    expect(ast.attrs.styleName).toBe('a')
    expect(vnode.properties.styleName).toBe('a')
    expect(vnode.properties.className).toBeUndefined()
  })

  it('no state component are in normal use', () => {
    const a = () => '<div>{{a}}</div>'
    class b extends Component {
      constructor () {
        super()
        this.state = { a: 1 }
      }
      template () {
        return '<div styleName="a"><Child :a="a"/></div>'
      }
      component () {
        return { Child: a }
      }
    }
    expect(b.mount().$el.textContent).toBe('1')
  })

  it('component can only contain one root node', () => {
    class cm extends Component {
      template () {
        return (`
          <div></div>
          <div></div>
        `)
      }
    }
    expect(throwComponent(cm)).toThrowError('rethrow')
  })

  it('the html tag is not closed', () => {
    class cm extends Component {
      template () {
        return '<div><div>'
      }
    }
    expect(throwComponent(cm)).toThrowError('rethrow')
  })

  it('the html single tag is not closed', () => {
    class cm extends Component {
      template () {
        return '<a>'
      }
    }
    expect(throwComponent(cm)).toThrowError('rethrow')
  })

  it('setState method', done => {
    (class p extends Component {
      createBefore () {
        this.state = { a: 1 }
        setTimeout(() => {
          this.setState({ a: 2 })
        })
      }
      created (dom) {
        expect(dom.textContent).toBe('1')
      }
      didUpdate (dom) {
        expect(dom.textContent).toBe('2')
        done()
      }
      template () {
        return '<div>{{a}}</div>'
      }
    }).mount()
  })

  it('setState is async changed state', done => {
    (class p extends Component {
      createBefore () {
        this.state = { a: 1 }
        this.template = '<div></div>'
      }
      created () {
        this.setState({ a: 2 })
        expect(this.state.a).toBe(1)
        this.setState({ a: 3 })
        expect(this.state.a).toBe(1)
        setTimeout(() => {
          expect(this.state.a).toBe(3)
          done()
        })
      }
    }).mount()
  })
  
  it('setState arg is callback function', done => {
    (class p extends Component {
      createBefore () {
        this.state = { a: 1 }
        this.template = '<div></div>'
      }
      created () {
        this.setState({ a: 2 })
        this.setState(state => {
          expect(state.a).toBe(2)
          return { a: 3 }
        })
        this.setState(state => {
          expect(state.a).toBe(3)
          state.a = 4
          return state
        })
        expect(this.state.a).toBe(1)
        setTimeout(() => {
          expect(this.state.a).toBe(4)
          done()
        })
      }
    }).mount()
  })

  it('getComponent method', done => {
    const a = () => '<a/>'
    class p extends Component {
      template () {
        return (`
          <div>
            <Child/>
            <child-async></child-async>
          </div>
        `)
      }
      component () {
        return {
          Child: a,
          'child-async': Grass.async((resolve) => {
            setTimeout(() => {
              resolve(a)
            })
          }, (err, compClass) => {
            expect(err).toBeNull()
            expect(compClass).toBe(a)
            expect(this.getComponent('child-async')).toBe(compClass)
            done()
          })
        }
      }
    }
    const cm = p.mount()
    expect(cm.getComponent('Child')).toBe(a)
    expect(cm.getComponent('child-async')).toBeNull()
  })

  it('createState method', () => {
    const obj = { a: 1 }
    Object.setPrototypeOf(obj, { b: 2 })
    class p extends Component {
      createBefore () {
        this.createState(obj)
      }
      template () {
        return '<div>{{a}}</div>'
      }
    }
    const cm = p.mount()
    expect(cm.$el.textContent).toBe('1')
    expect(cm.state.b).toBeUndefined()
    expect(Object.getPrototypeOf(cm.state)).toBeNull()
  })

  it('createResponseState method', () => {
    const obj = { a: 1 }
    Object.setPrototypeOf(obj, { b: 2 })
    class p extends Component {
      createBefore () {
        this.createResponseState(obj)
      }
      template () {
        return '<div>{{a}}</div>'
      }
    }
    const cm = p.mount()
    expect(cm.$el.textContent).toBe('1')
    expect(cm.state.b).toBeUndefined()
    expect(Object.getPrototypeOf(cm.state)).toBeNull()
    expect(typeof cm.state.__ob__).toBe('object')
    expect(typeof cm.state.__ob__).not.toBeNull()
  })

  it('default slot', () => {
    class a extends Component {
      created () {
        expect(this.$slot.length).toBe(1)
        expect(this.$el.textContent).toBe('1')
        expect(this.$slot[0].tagName).toBe('SPAN')
        expect(isVNode(this.$slot[0])).toBeTruthy()
      }
      template () {
        return (`
          <div>
            <slot></slot>
          </div>
        `)
      }
    }
    (class b extends Component {
      createBefore () {
        this.state = { a: 1 }
        this.component = { Child: a }
      }
      template () {
        return (`
          <div>
            <Child>
              <span>{{a}}</span>
            </Child>
          </div>
        `)
      }
    }).mount()
  })

  it('slot name', () => {
    class a extends Component {
      created () {
        expect(this.$slot.length).toBe(3)
        expect(this.$el.textContent).toBe('12c2c')
        expect(this.$slot[0].tagName).toBe('SPAN')
        expect(this.$slot[1].tagName).toBe('SPAN')
        expect(this.$slot[2].container.vtree.tagName).toBe('DIV')
        expect(isVNode(this.$slot[0])).toBeTruthy()
        expect(isVNode(this.$slot[1])).toBeTruthy()
        expect(isWidget(this.$slot[2])).toBeTruthy()
      }
      template () {
        return (`
          <div>
            <slot></slot>
            <slot name="b"></slot>
            <slot name="c"></slot>
          </div>
        `)
      }
    }
    (class b extends Component {
      createBefore () {
        this.state = { a: 1, b: 2 }
        this.component = {
          Child: a,
          Comp: () => '<div>c</div>',
        }
      }
      template () {
        return (`
          <div>
            <Child>
              <span slot="a">{{a}}</span>
              <span slot="b">{{b}}</span>
              <Comp slot="c"></Comp>
            </Child>
          </div>
        `)
      }
    }).mount()
  })

  it('component name', () => {
    const a = () => '<div></div>'
    class p extends Component {
      createBefore () {
        this.template = '<div><Child/></div>'
        this.component = { Child: a }
      }
    }
    const cm = Grass.mount(null, p)
    expect(cm.name).toBe('p')
    expect(cm.$children.Child.name).toBe('Child')
  })
})