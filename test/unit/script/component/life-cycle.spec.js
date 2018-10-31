import Grass from '../../../../src'
import * as _ from '../../../../src/utils'
import { createComp, throwComponent } from '../../util'
import { isWidget, isVNode } from '../../../../src/virtual-dom/vnode/typeof-vnode'

const Comp = Grass.Component

describe('组件的创建', () => {
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
    })
    expect(typeof cm.mount() === 'object').toBeTruthy()
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

    class p extends Comp {
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
})