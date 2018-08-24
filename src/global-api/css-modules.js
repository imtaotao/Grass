import * as _ from '../utils/index'

let compName

export function CSSModules (style) {
  return component => {
    if (!component || _.isEmptyObj(style)) {
      return component
    }

    component.CSSModules = function (vnodeConf, _compName) {
      compName = _compName
      if (havStyleName(vnodeConf)) {
        replaceStyleName(vnodeConf.attrs, style)
      }

      applyChildren(vnodeConf, style)
    }
  }
}

function applyChildren (config, style) {
  if (!config) {
    return
  }

  const children = config.children

  if (children) {
    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i]

      if (havStyleName(child)) {
        replaceStyleName(child.attrs, style)
      }

      applyChildren(child, style)
    }
  }
}

function replaceStyleName (attrs, style) {
  const styleString = attrs.styleName

  if (typeof styleString === 'string') {
    const styleNames = styleString.split(' ')
    let result = ''

    for (let i = 0, len = styleNames.length; i < len; i++) {
      const styleName = styleNames[i]

      if (styleName && _.hasOwn(style, styleName)) {
        const value = style[styleName]

        result += !result ? value : ' ' + value
      } else if (styleName) {
        _.warn(`"${styleName}" CSS module is undefined  \n\n    --->  ${compName || 'unknow'}\n`)
      }
    }

    if (result) {
      attrs.styleName = undefined
      mergeClassName(attrs, result)
    }
  }
}

function mergeClassName (attrs, classResult) {
  if (!attrs.className) {
    attrs.className = classResult
  } else {
    attrs.className += ' ' + classResult
  }
}

function havStyleName (node) {
  return (
    node &&
    node.attrs &&
    node.attrs.styleName
  )
}