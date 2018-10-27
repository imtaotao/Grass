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
  if (factory.error === true && factory.errorComp) {
    return factory.errorComp
  }

  if (factory.resolved) {
    return factory.resolved
  }

  if (factory.loading === true && factory.loadingComp) {
    return factory.loadingComp
  }

  if (Array.isArray(factory.context)) {
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
      _.warn('Failed to resolve async component: ' + (reason ? reason : ''), true)

      if (factory.errorComp != null) {
        factory.error = true
        forceRender()
      }
    })

    const res = factory(resolve, reject)

    dealWithResult(res, factory, resolve, reject, forceRender)

    sync = false

    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

function dealWithResult (res, factory, resolve, reject, forceRender) {
  if (!_.isObject(res)) return

  if (typeof res.then === 'function') {
    if (_.isUndef(factory.resolved)) {
      res.then(resolve, reject)
    }
  } else if (res.component && typeof res.component.then === 'function' ) {
    const { error, delay, loading, timeout, component } = res

    component.then(resolve, reject)

    if (error) {
      factory.errorComp = ensureCtor(error)
    }

    if (loading) {
      factory.loadingComp = ensureCtor(loading)

      if (delay === 0) {
        // Into loading state.
        factory.loading = true
      } else {
        setTimeout(() => {
          // Maybe resolved method alread call.
          if (_.isUndef(factory.resolve) && _.isUndef(factory.error)) {
            factory.loading = true
            // We need show loading component
            forceRender()
          }
        }, delay || 200)
      }
    }

    if (_.isNumber(timeout)) {
      setTimeout(() => {
        if (_.isUndef(factory.resolved)) {
          reject(`timeout (${res.timeout}ms)`)
        }
      }, timeout)
    }
  }
}

function ensureCtor (component) {
  if (
    component.__esModule ||
    (_.hasSymbol && component[Symbol.toStringTag] === 'Module')
  ) {
    component = component.default
  }

  return component
}