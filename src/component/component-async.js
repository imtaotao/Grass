/**
 * （）=> {
 *    component: import('./MyComp.grs'),
 *     // 加载中应当渲染的组件
 *    loading: LoadingComp,
 *     // 出错时渲染的组件
 *    error: ErrorComp,
 *     // 渲染加载中组件前的等待时间。默认：200ms。
 *    delay: 200,
 *     // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
 *    timeout: 3000
 *  }
 **/
import * as _ from '../utils/index'

export function createAsyncComponent (factory, context) {
  if (factory.error === true && factory.errorComp != null) {
    return factory.errorComp
  }

  if (factory.resolved != null) {
    return factory.resolved
  }

  if (factory.loading === true && factory.loadingComp != null) {
    return factory.loadingComp
  }

  if (factory.context != null) {
    // This asynchronous component may be used in multiple places.
    factory.context.push(context)
  } else {
    const contexts = factory.context = [context]
    let sync = true

    const forceRender = () => {
      for (let i = 0, len = contexts.length; i < len; i++) {
        contexts[i].forceUpdate()
      }
    }

    const resolve = _.once(res => {
      factory.resolved = ensureCtor(res)
      if (!sync) {
        forceRender()
      }
    })

    const reject = _.once(reason => {
      if (factory.errorComp != null) {
        factory.error = true
        forceRender()
      }
    })

    const res = factory(resolve, reject)

    dealWithResult(res, factory, resolve, reject)

    sync = false

    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

function dealWithResult (res, factory, resolve, reject) {
  if (!_.isObject(res)) return

  if (typeof res.then === 'function') {
    if (_.isUndef(factory.resolved)) {
      res.then(resolve, reject)
    }
  } else {
    
  }
}

function ensureCtor (component) {
  if (
    component.__esModule ||
    (hasSymbol && component[Symbol.toStringTag] === 'Module')
  ) {
    component = component.default
  }

  return component
}