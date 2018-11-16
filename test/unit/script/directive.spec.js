import Grass from '../../../src'
import * as _ from '../../../src/utils'
import { componentThrowErr } from '../util'
import { isVText } from '../../../src/virtual-dom/vnode/typeof-vnode'

const Component = Grass.Component

describe('directive', () => {
  it('v-on', () => {
    class p extends Component {
      click () {}
      enter () {}
      template () {
        return (`
          <div>
            <div v-on:click="this.click"></div>
            <a v-on:mouseenter="this.enter"></a>
          </div>
        `)
      }
    }
    const cm = p.$mount()
    expect(cm.$el.children[0].onclick).toBe(cm.click)
    expect(cm.$el.children[1].onmouseenter).toBe(cm.enter)
  })

  it('v-on align', () => {
    class p extends Component {
      click () {}
      enter () {}
      template () {
        return (`
          <div>
            <div @click="this.click"></div>
            <a @mouseenter="this.enter"></a>
          </div>
        `)
      }
    }
    const cm = p.$mount()
    expect(cm.$el.children[0].onclick).toBe(cm.click)
    expect(cm.$el.children[1].onmouseenter).toBe(cm.enter)
  })

  it('v-on.self', done => {
    class p extends Component {
      click (e) {
        expect(e.target).toBe(e.currentTarget)
        done()
      }
      template () {
        return (`
          <div>
            <span @click.self="this.click"></span>
          </div>
        `)
      }
    }
    const cm = p.$mount()
    const el = cm.$el.querySelector('span')
    el.click()
    expect(el.onclick).not.toBe(cm.click)
    expect(el.onclick.name).toBe('eventCallback')
  })

  it('v-bind', () => {
    class p extends Component {
      beforeCreate () {
        this.state = { a: 2 }
        this.template = '<div a="1" v-bind:a="a"></div>'
      }
    }
    const cm = p.$mount()
    expect(cm.$widgetVNode.container.vtree.properties.attributes.a).toBe(2)
  })

  it('v-bind align', () => {
    class p extends Component {
      beforeCreate () {
        this.state = { a: 2 }
        this.template = '<div a="1" :a="a"></div>'
      }
    }
    const cm = p.$mount()
    expect(cm.$widgetVNode.container.vtree.properties.attributes.a).toBe(2)
  })

  it('v-bind:style', () => {
    class p extends Component {
      beforeCreate () {
        this.state = {
          style: { height: '2px', marginRight: '3px' },
        }
        this.template = '<div style="height:1px; width: 2px;" :style="style"></div>'
      }
    }
    const obj = {}
    const cm = p.$mount()
    const string = cm.$widgetVNode.container.vtree.properties.style
    string.split(';').forEach(item => {
      if (!item) return
      const [key, value] = item.split(':')
      obj[key.trim()] = value.trim()
    })
    expect(obj.height).toBe('1px')
    expect(obj.width).toBe('2px')
    expect(obj['margin-right']).toBe('3px')
  })

  it('v-if', done => {
    class a extends Component {
      beforeCreate () {
        this.state = { show: true }
        this.template = '<div v-if="show"></div>'
      }
    }
    class b extends Component {
      c() {}
      beforeCreate () {
        this.state = { show: true }
        this.template = '<div><span v-if="show" @click="this.c">a</span></div>'
        setTimeout(() => {
          this.setState({ show: false })
        })
      }
      didUpdate () {
        expect(this.$el.textContent).toBe('')
        expect(this.$widgetVNode.container.vtree.children.length).toBe(0)
        done()
      }
    }
    const cm = b.$mount()
    const node = b.$ast.children[0]
    expect(componentThrowErr(a)).toThrowError('rethrow')
    expect(cm.$el.textContent).toBe('a')
    expect(node.if).toBeTruthy()
    expect(node.tagName).toBe('span')
    expect(cm.$widgetVNode.container.vtree.children[0].properties.onclick).toBe(cm.c)
    expect(cm.$el.children[0].onclick).toBe(cm.c)
  })

  it('v-show', done => {
    class p extends Component {
      c() {}
      beforeCreate () {
        this.state = {
          show: true,
          style: { height: '1px' },
        }
        this.template = '<div v-show="show" :style="style"></div>'
        setTimeout(() => {
          this.setState({ show: false })
        })
      }
      didUpdate () {
        const style = this.$widgetVNode.container.vtree.properties.style
        expect(this.$el.textContent).toBe('')
        expect(style).toBe('height: 1px;display: none')
        done()
      }
    }
    const cm = p.$mount()
    const style = cm.$widgetVNode.container.vtree.properties.style
    expect(cm.$el.textContent).toBe('')
    expect(p.$ast.tagName).toBe('div')
    expect(style).toBe('height: 1px;')
  })

  it('v-text', done => {
    class p extends Component {
      c() {}
      beforeCreate () {
        this.state = { a: 1 }
        this.template = '<div v-text="a">2</div>'
        setTimeout(() => {
          this.setState({ a: 2 })
        })
      }
      didUpdate () {
        expect(this.$el.textContent).toBe('22')
        done()
      }
    }
    const cm = p.$mount()
    const children = cm.$widgetVNode.container.vtree.children
    expect(cm.$el.textContent).toBe('12')
    expect(children.length).toBe(2)
    expect(isVText(children[0])).toBeTruthy()
    expect(isVText(children[1])).toBeTruthy()
    expect(children[0].text).toBe('1')
    expect(children[1].text).toBe('2')
  })

  it('v-transition', done => {
    class p extends Component {
      beforeEnter (dom) {
        setTimeout(() => {
          expect(typeof dom._enterCb).toBe('function')
          expect(dom._leaveCb).toBeUndefined()
        })
      }
      afterEnter (dom) {
        setTimeout(() => {
          expect(dom._enterCb).toBeNull()
        })
      }
      beforeLeave (dom) {
        setTimeout(() => {
          expect(typeof dom._leaveCb).toBe('function')
          expect(dom._enterCb).toBeNull()
        })
      }
      afterLeave (dom) {
        setTimeout(() => {
          expect(dom._leaveCb).toBeNull()
          expect(dom._enterCb).toBeNull()
          done()
        })
      }
      beforeCreate () {
        this.state = { show: true }
        this.template = `
          <div
            v-show="show"
            v-transition="'fade'"
            v-beforeEnter="this.beforeEnter"
            v-afterEnter="this.afterEnter"
            v-beforeLeave="this.beforeLeave"
            v-afterLeave="this.afterLeave"></div>
        `
        setTimeout(() => {
          this.setState({ show: false })
        }, 20)
      }
    }
    const cm = p.$mount()
    const vnode = cm.$widgetVNode.container.vtree
    expect(vnode.data.haveShowTag).toBeTruthy()
    expect(vnode.data.vTransitionType).toBe('transition')
    expect(vnode.data.vTransitionData.name).toBe('fade')
    expect(vnode.data.vTransitionData.hookFuns['v-beforeEnter']).toBe(cm.beforeEnter)
  })

  it('v-transiton.animate', done => {
    class p extends Component {
      beforeEnter (dom) {
        setTimeout(() => {
          expect(dom._enterCb).toBeUndefined()
          expect(dom._leaveCb).toBeUndefined()
        })
        return false
      }
      afterEnter (dom) {
        setTimeout(() => {
          expect(dom._enterCb).toBeUndefined()
        })
      }
      beforeLeave (dom) {
        setTimeout(() => {
          expect(typeof dom._leaveCb).toBe('function')
          expect(dom._enterCb).toBeUndefined()
        })
      }
      afterLeave (dom) {
        setTimeout(() => {
          expect(dom._leaveCb).toBeNull()
          expect(dom._enterCb).toBeUndefined()
          done()
        })
      }
      beforeCreate () {
        this.state = { show: true }
        this.template = `
          <div
            v-show="show"
            v-transition.animate="'fade'"
            v-beforeEnter="this.beforeEnter"
            v-afterEnter="this.afterEnter"
            v-beforeLeave="this.beforeLeave"
            v-afterLeave="this.afterLeave"></div>
        `
        setTimeout(() => {
          this.setState({ show: false })
        }, 20)
      }
    }
    const cm = p.$mount()
    const vnode = cm.$widgetVNode.container.vtree
    expect(vnode.data.haveShowTag).toBeTruthy()
    expect(vnode.data.vTransitionType).toBe('animation')
    expect(vnode.data.vTransitionData.name).toBe('fade')
    expect(vnode.data.vTransitionData.hookFuns['v-beforeEnter']).toBe(cm.beforeEnter)
  })

  it('v-for', () => {
    class a extends Component {
      beforeCreate () {
        this.state = { arr: [1, 2] }
      }
      template () {
        return '<div v-for="val of arr">{{val}}</div>'
      }
    }
    class b extends Component {
      beforeCreate () {
        this.state = {
          arr: [1, 2],
          obj: { one: 1, two: 2 },
        }
      }
      template () {
        return (`
          <div>
            <span v-for="val of arr">{{val}}</span>
            <span v-for="(val, key) of obj">{{key}}{{val}}</span>
          </div>
        `)
      }
    }
    const cm = b.$mount()
    expect(componentThrowErr(a)).toThrowError('rethrow')
    expect(cm.$el.textContent).toBe('12one1two2')
    expect(cm.$el.children.length).toBe(4)
  })

  it('complex v-for', () => {
    class b extends Component {
      beforeCreate () {
        this.state = {
          data: {
            arr: [1, 2],
            obj: {
              a: 3,
              b: 4,
            }
          },
        }
      }
      template () {
        return (`
          <div>
            <div v-for="val of data">
              <span v-for="(val, key) of val">
                {{key}}{{val}}
              </span>
            </div>
          </div>
        `)
      }
    }
    const cm = b.$mount()
    const key = '[\\s\\S]*'
    const reg = new RegExp(`01${key}12${key}a3${key}b4`, 'g')
    expect(reg.test(cm.$el.textContent)).toBeTruthy()
  })
})