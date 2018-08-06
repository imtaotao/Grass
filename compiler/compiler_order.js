import { priority } from './directives'
import { isObject } from '../utils'

export function complierTemplate (ast, componentConf) {
  !componentConf.data && (componentConf.data = {})
  if (!isObject(componentConf.data)) {
    throw Error('[Grass tip]: Component data must be a "Object"')
  }

  dealSingleNode(ast[0].children[1], componentConf)
}

function dealSingleNode (node, componentConf) {
  console.log(node);
  // v-for v-bind v-if @
  if (node.type === 2) {
    if (node.type === 2 && node.tagName === 'template') {
      isLegalComponent(node)
      return null
    }

    // 处理有指令的情况
    if (node.hasBindings()) {
      const sortOrder = []
      let currentWeight = null
      for (const order of node.direction) {
        // 拿到各个指令的权重
        const key = Object.keys(order)
        const weight = priority(key)
        // 清除重复的指令
        if (weight === currentWeight) continue

        currentWeight = weight
        sortOrder[weight] = order[key]
      }

      // 我们现在定义了五种指令
      for (let i = 4; i > -1; i--) {
        const val = sortOrder[i]
        // 如果一个指令没有赋值，我们过滤掉
        if (!val) continue
        const condition = delOrder(i, val, node, componentConf)
        // 我们需要判断 v-if，如果是 false 我们根本就没有必要继续下去
        if (i === 0 && condition === false) {
          return condition
        }
      }
    }
  }
}

function delOrder (key, val, node, componentConf) {
  switch (key) {
    case 0 :
      return show(node, val, componentConf)
    case 1 :
      vFor(node, val, componentConf)
      break
    case 2 :
      on(node, val, componentConf)
      break
    case 3 :
      text(node, val, componentConf)
      break
    case 4 :
      vIf(node, val, componentConf)
      break
  }
}

function isLegalComponent (node) {
  let componentNumber = 0

  for (const child of node.children) {
    if (
        child.type === 2 ||
        child.expression ||
        child.content && child.content.trim()
    ) {
      componentNumber++

      if (componentNumber > 1) {
        throw Error('[Grass tip]: Template component only one child')
      }
    }
  }
}

function createFunction (funStr) {
  return new Function('_obj', funStr)
}

function show (node, val, componentConf) {
  const fun = createFunction(`
    with(_obj) {
      return !!(${val})
    }
  `)

  return fun.call(componentConf, componentConf.data || {})
}

function vFor (node, val, componentConf) {
  console.log(val);
}

function on (node, val, componentConf) {

}

function text (node, val, componentConf) {

}

function vIf (node, val, componentConf) {

}