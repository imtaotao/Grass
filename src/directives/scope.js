// 用 原型链 模仿 作用域链
// 需要创建一个作用域，直接 creat()
// 创建之后需要添加变量直接 add(key, val)
// 当前执行环境出栈后，执行 destroy() 让当前作用域退回上一级
// 没有 reset 操作
// 可以用 insertChain(obj) 让作用域链最顶层作用域为 obj
// 每个组件编译完成后都要重置 scope，我们保证一个组件一个 scope

import * as _ from '../utils/index'

let scope = null
let chain = [scope]

function create (s) {
  if (s) {
    Object.setPrototypeOf(s, scope)
    chain.push(s)
    return s
  }

  scope = Object.create(scope)
  chain.push(scope)
  return scope
}

function add (key, val) {
  if (typeof key !== 'string') {
    _.warn('The variable name of the "for" scope must be a "string"')
    return
  }
  scope[key] = val
}

function destroy () {
  if (scope === null) {
    return scope
  }
  chain.pop()
  scope = chain[chain.length - 1]
  return scope
}

function getScope () {
  return scope
}

function insertChain (obj) {
  if (!isLegScope(obj)) {
    _.warn('Insert "scope" must be a "object"')
    return
  }
  if (scope === null) return obj

  const ancestor = chain[1]

  if (obj !== ancestor) {
    Object.setPrototypeOf(ancestor, obj)
    chain.splice(1, 0, obj)
  }

  return scope
}

function resetScope () {
  scope = null
  chain = [scope]
}

function isLegScope (obj) {
  if (_.isPlainObject(obj)) {
    const prototype = Object.getPrototypeOf(obj)
    return prototype === null || prototype === Object.prototype
  }
  return false
}

export default {
  add,
  create,
  destroy,
  getScope,
  resetScope,
  insertChain,
}