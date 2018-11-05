import Grass from '../../../src'
import * as _ from '../../../src/utils'
import { createComp, throwComponent } from '../util'
import { isWidget, isVNode } from '../../../src/virtual-dom/vnode/typeof-vnode'

const Component = Grass.Component

describe('组件', () => {
  it('缺失 template 函数，不能创建组件', () => {
    const cm = createComp({})
    expect(throwComponent(cm)).toThrowError('rethrow')
  })

  it('template 函数未返回 string', () => {
    const cm = createComp({template () {}})
    expect(throwComponent(cm)).toThrowError('rethrow')
  })

  it('能正确创建组件', () => {
    const cm = createComp({
      template () { return '<div>a</div>' }
    }).mount()

    expect(typeof cm === 'object').toBeTruthy()
    expect(isWidget(cm.$widgetVNode)).toBeTruthy()
  })

  it('创建组件后 vnode container 正确', () => {
    const comp = createComp({
      template () { return '<div>a</div>'}
    }).mount()

    expect(isVNode(comp.$widgetVNode.container.vtree)).toBeTruthy()
    expect(comp.$widgetVNode.container.dom.textContent).toBe('a')
  })

  it('组件创建后的 state、props、el 正确', () => {
    const comp = createComp({
      template () { return '<div>a</div>'}
    }).mount()

    expect(!comp).toBeFalsy()
    expect(comp.state && _.isEmptyObj(comp.state)).toBeTruthy()
    expect(comp.props && _.isEmptyObj(comp.props)).toBeTruthy()
    expect(comp.$el.textContent).toBe('a')
  })

  it('父子组件嵌套成功', () => {
    const c = createComp({
      template () {return '<a>child</a>'}
    })

    class p extends Component {
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
        return { Child: c }
      }
    }

    const ccm = c.mount()
    const pcm = p.mount()

    expect(ccm.$el.textContent).toBe('child')
    expect(_.isEmptyObj(ccm.$children)).toBeTruthy()
    expect(ccm.$parent).toBeNull()

    expect(pcm.$el.textContent.trim()).toBe('parent child')
    expect(pcm.$children.Child).toBeDefined()
    expect(pcm.$parent).toBeNull()
    expect(pcm.$children.Child.$parent).toBe(pcm)
    expect(pcm.$children.Child.props.t).toBe(1)
  })

  it('CSSModules 与 styleName 正常', () => {
    const style = { a: 'b' }
    const compClass = createComp({
      template () {
        return '<div styleName="a"></div>'
      }
    })

    const comp = Grass.CSSModules(style)(compClass).mount()
    const ast = comp.constructor.$ast
    const vnode = comp.$widgetVNode.container.vtree

    expect(ast.attrs.styleName).toBe('a')
    expect(vnode.properties.className).toBe('b')
  })

  it('无状态组件使用 CSSModules', () => {
    const style = { a: 'b' }
    const compClass = Grass.CSSModules(style)(() => '<div styleName="a"></div>')

    const comp = Grass.mount(null, compClass)
    const ast = comp.constructor.$ast
    const vnode = comp.$widgetVNode.container.vtree

    expect(ast.attrs.styleName).toBe('a')
    expect(vnode.properties.className).toBe('b')
  })

  it('未使用 CSSModules 方法，不能使用 styleName', () => {
    const compClass = createComp({
      template () {
        return '<div styleName="a"></div>'
      }
    })

    const comp = compClass.mount()
    const ast = comp.constructor.$ast
    const vnode = comp.$widgetVNode.container.vtree

    expect(ast.attrs.styleName).toBe('a')
    expect(vnode.properties.styleName).toBe('a')
    expect(vnode.properties.className).toBeUndefined()
  })

  it('无状态组件正常使用', () => {
    class parent extends Component {
      constructor () {
        super()
        this.state = {
          a: 1,
        }
      }
      template () {
        return '<div styleName="a"><child :a="a"/></div>'
      }
      component () {
        return { child }
      }
    }

    function child (props) {
      return '<div>{{a}}</div>'
    }

    expect(parent.mount().$el.textContent).toBe('1')
  })

  it('组件只能包含一个根节点', () => {
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

  it('html 标签没有闭合不会导致死循环', () => {
    class cm extends Component {
      template () {
        return '<div><div>'
      }
    }

    expect(throwComponent(cm)).toThrowError('rethrow')
  })
})