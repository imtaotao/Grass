/**
 * （）=> {
 *    component: import('./MyComp.grs'),
 *     // 加载中应当渲染的组件
 *    loading: LoadingComp,
 *     // 出错时渲染的组件
 *    error: ErrorComp,
 *     // 渲染加载中组件前的等待时间。默认：0ms。
 *    delay: 200,
 *     // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
 *    timeout: 3000
 *  }
 **/
import * as _ from '../utils/index'

export function createAsyncComponent (factory, context, cb) {
  if (factory.error && factory.errorComp) {
    return factory.errorComp
  }

  // Judge 'fatory.error' because 'fatory.error' has the highest priority.
  if (!factory.error && factory.resolved) {
    return factory.resolved
  }

  if (!factory.error && factory.loading && factory.loadingComp) {
    return factory.loadingComp
  }

  if (Array.isArray(factory.context)) {
    // This asynchronous component may be used in multiple places.
    factory.context.push(context)
  } else {
    const contexts = factory.context = [context]
    let sync = true
    let complete = false

    const forceRender = () => {
      for (let i = 0, len = contexts.length; i < len; i++) {
        contexts[i].forceUpdate()
      }
    }

    const resolve = _.once(res => {
      if (complete) return

      factory.resolved = ensureCtor(res)
      if (!sync) {
        if (typeof cb === 'function') {
          cb(null, factory.resolved)
        }
        forceRender()
        complete = true
      }
    })

    const reject = _.once(reason => {
      if (complete) return

      if (typeof cb === 'function') {
        cb(reason, null)
      } else {
        _.warn('Failed to resolve async component: ' + (reason ? reason : ''), true)
      }

      factory.error = true
      complete = true

      // If no errorComponent, we need remove loading compent or nothing to do. 
      // if (factory.errorComp) {
        forceRender()
      // }
    })

    const res = factory(resolve, reject)

    dealWithResult(res, factory, resolve, reject, context, forceRender)

    sync = false

    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

function dealWithResult (res, factory, resolve, reject, context, forceRender) {
  if (!_.isObject(res)) return

  if (typeof res.then === 'function') {
    if (_.isUndef(factory.resolved)) {
      res.then(resolve, reject)
    }
  } else if (res.component && typeof res.component.then === 'function' ) {
    const { error, delay = 0, loading, timeout, component } = res

    component.then(resolve, reject)

    const setUtilComp = (comp, name) => {
      if (comp.async) {
        createAsyncComponent(comp.factory, context, (err, cm) => {
          if (!err) {
            factory[name] = cm
          }
        })
      } else {
        factory[name] = comp
      }
    }

    if (error) {
      setUtilComp(error, 'errorComp')
    }

    if (loading) {
      setUtilComp(loading, 'loadingComp')

      if (delay === 0) {
        // Into loading state.
        factory.loading = true
      } else if (_.isNumber(delay)) {
        setTimeout(() => {
          // Maybe resolved method alread call.
          if (_.isUndef(factory.resolved) && _.isUndef(factory.error)) {
            factory.loading = true
            // We need show loading component
            forceRender()
          }
        }, delay)
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