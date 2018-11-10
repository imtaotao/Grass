import Grass from '../../../src'
import * as _ from '../../../src/utils'
import { throwComponent } from '../util'
import { isVNode } from '../../../src/virtual-dom/vnode/typeof-vnode'

const {
  mount,
  mixin,
  event,
  async,
  Component,
  directive,
  forceUpdate,
} = Grass

describe('Global API', () => {
  it('mount and $mount', () => {
    class p extends Component {
      template () {
        return '<div></div>'
      }
    }
    const a = mount(null, p)
    const b = p.$mount()
    expect(a.set).toBe(b.set)
    expect(a.delete).toBe(b.delete)
  })

  it('forceUpdate', done => {
    class p extends Component {
      template () {
        return '<div></div>'
      }
      willUpdate (dom) {
        expect(typeof dom).toBe('object')
        done()
      }
    }
    forceUpdate(p.$mount())
  })

  it('event', done => {
    let count = { i: 0 }
    class a extends Component {
      created () {
        setTimeout(() => {
          this.next(count)
              .next(count)
              .done(count)
          this.next(count)

          expect(count.i).toBe(4)
          done()
        }, 1000)
      }
      template () {
        return '<div></div>'
      }
    }
    class b extends Component {
      created () {
        a.on(data => {
          expect(data.i).toBe(count.i)
          count.i++
        })
        a.once(data => {
          expect(data.i).toBe(count.i)
          count.i++
        })
        a.done(data => {
          expect(data.i).toBe(count.i)
          count.i++
        })
      }
      template () {
        return '<div></div>'
      }
    }
    const cm = event(a).$mount()
    b.$mount()
    expect(a.remove).toBe(cm.remove)
  })

  it('event error', done => {
    let count = 0
    class a extends Component {
      created () {
        setTimeout(() => {
          this.next().error('error')
          this.next()
          expect(count).toBe(1)
          done()
        })
      }
      template () {
        return '<div></div>'
      }
    }
    event(a).$mount()
    a.on(() => {
      count++
    })
    a.error(err => {
      expect(err).toBe('error')
    })
  })

  it('Event help method', done => {
    class a extends Component {
      created () {
        setTimeout(() => {
          this.tNext('one', 1)
              .tNext('two', 2)

          done()
        })
      }
      template () {
        return '<div></div>'
      }
    }
    event(a).$mount()
    a.listener('one', data => {
      expect(data).toBe(1)
    })
    a.listener('two', data => {
      expect(data).toBe(2)
    })
  })

  it('no state component event', () => {
    const p = () => '<div></div>'
    expect(throwComponent(() => event(p))).toThrowError('rethrow')
  })

  it('async component', done => {
    class a extends Component {
      template () {
        return `<div>a</div>`
      }
    }
    class b extends Component {
      didUpdate () {
        expect(this.$el.textContent).toBe('a')
        done()
      }
      template () {
        return '<div><Child/></div>'
      }
      component () {
        return {
          Child: async((resolve) => {
            setTimeout(() => {
              resolve(a)
            })
          }, (err, com) => {
            expect(err).toBeNull()
            expect(com).toBe(a)
          })
        }
      }
    }
    b.$mount()
    const factory = () => {}
    const cb = () => {}
    const asyncComp = async(factory, cb)
    expect(asyncComp.async).toBeTruthy()
    expect(asyncComp.factory).toBe(factory)
    expect(asyncComp.cb).toBe(cb)
  })

  it('complex async component', done => {
    class a extends Component {
      template () {
        return `<div>a</div>`
      }
    }
    class b extends Component {
      didUpdate () {
        expect(this.$el.textContent).toBe('a')
        done()
      }
      template () {
        return '<div><Child/></div>'
      }
      component () {
        return {
          Child: async((resolve) => ({
            component: new Promise(() => {
              setTimeout(() => {
                resolve(a)
              })
            }),
            timeout: 100,
            delay: 0,
            loading: () => '<div>loading</div>',
          }), (err, com) => {
            expect(err).toBeNull()
            expect(com).toBe(a)
          })
        }
      }
    }
    expect(b.$mount().$el.textContent).toBe('loading')
  })

  it('complex async component delay', done => {
    class a extends Component {
      template () {
        return `<div>a</div>`
      }
    }
    class b extends Component {
      template () {
        return '<div><Child/></div>'
      }
      component () {
        return {
          Child: async((resolve) => ({
            component: new Promise(() => {
              setTimeout(() => {
                resolve(a)
                done()
              })
            }),
            timeout: 100,
            delay: 1,
            loading: () => '<div>loading</div>',
          }))
        }
      }
    }
    expect(b.$mount().$el.textContent).toBe('')
  })

  it('directive', done => {
    class p extends Component {
      template () {
        return `<div v-tt="'custom'">a</div>`
      }
    }
    directive('tt', (dom, val, vnode) => {
      expect(dom.textContent).toBe('a')
      expect(val).toBe('custom')
      expect(isVNode(vnode)).toBeTruthy()
      done()
    })
    p.$mount()
  })

  it('single mixin', () => {
    class a extends Component {
      template () {
        return '<div></div>'
      }
    }
    class b extends Component {
      template () {
        return '<div></div>'
      }
    }
    const two = () => {}
    mixin({
      one: 1,
      two,
    })
    const cma = a.$mount()
    const cmb = b.$mount()
    expect(cma.one).toBe(1)
    expect(cma.two).toBe(two)
    expect(cmb.one).toBe(1)
    expect(cmb.two).toBe(two)
    delete Component.prototype.one
    delete Component.prototype.two
  })

  it('mixin', () => {
    class a extends Component {
      template () {
        return '<div></div>'
      }
    }
    class b extends Component {
      template () {
        return '<div></div>'
      }
    }
    const two = () => {}
    mixin(a, {
      one: 1,
      two,
    })
    const cma = a.$mount()
    const cmb = b.$mount()
    expect(cma.one).toBe(1)
    expect(cma.two).toBe(two)
    expect(cmb.one).toBeUndefined()
    expect(cmb.two).toBeUndefined()
  })

  it('use', () => {
    let i = 0
    class p extends Component {
      template () {
        return '<div></div>'
      }
    }
    const plugin = (g, one, two) => {
      expect(g).toBe(Grass)
      expect(one).toBe(1)
      expect(two).toBe(2)
      mixin({ a: 11 })
      i++
    }
    Grass.use(plugin, 1, 2)
         .use(plugin, 1, 2)
    expect(i).toBe(1)
    expect(p.$mount().a).toBe(11)
    delete Component.prototype.a
  })
})