import { warn, isEmptyObj } from './tool'
import { isPlainObject, isPrimitive, isGeneratorFunction } from './type-check'

export function cached (fn) {
  const cache = Object.create(null)
  return function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

export function makeMap (str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

export function sendDirectWarn (direct, compName) {
  warn(`Cannot make "${direct}" directives on the root node of a component，
  Maybe you can specify the "${direct}" command on "<${compName} ${direct}="xxx" />"
    \n\n  ---> ${compName}\n`)
}

// 只允许对象、数组或者类数组进行深拷贝
// 我们只对循环引用的对象进行一层的检查，应该避免使用深层循环引用的对象
// 更好的工具函数可以用 lodash
export function deepClone (obj, similarArr) {
  let res
  if (isPlainObject(obj)) {
    res = new obj.constructor
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      let val = obj[keys[i]]
      // 避免循环引用
      if (val === obj) continue
      res[keys[i]] = canUse(val) ? val : deepClone(val, similarArr)
    }
    return res
  }

  if (Array.isArray(obj) || similarArr) {
    res = new obj.constructor
    for (let i = 0; i < obj.length; i++) {
      let val = obj[i]
      if (val === obj) continue
      res[i] = canUse(val) ? val : deepClone(val, similarArr)
    }
    return res
  }

  function canUse (val) {
    return (
      isPrimitive(val) ||
      val == null ||
      typeof val === 'function'
    )
  }

  return obj
}

// 判断一个 function 应该是以怎样的行为进行调用
// 箭头函数 与 async 没有 prototype
// class 语法在原型上添加的属性不可被遍历
// constructor 属性不可被遍历
export function isClass (fun) {
  const proto = fun.prototype
  if (!proto || isGeneratorFunction(fun)) {
    return false
  }

  if (isEmptyObj(proto)) {
    const constructor = proto.constructor

    if (constructor && constructor === fun) {
      const descriptors = Object.getOwnPropertyDescriptors(proto)

      return Object.keys(descriptors).length > 1
        ? true
        : false
    }

    // 如果没有 constructor，或者 constructor 被修改过
    // 我们认为这个 function 是有可能会被当成 class 来使用
    return true
  }

  return true
}