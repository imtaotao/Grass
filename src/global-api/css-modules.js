import * as _ from '../utils/index'

let compName

export default function CSSModules (styles) {
  return component => {
    if (component && !_.isEmptyObj(styles)) {
      component.$styles = styles
    }
    return component

    component.CSSModules = function (vnodeConf, _compName) {
      compName = _compName
      if (haveStyleName(vnodeConf)) {
        replaceStyleName(vnodeConf.attrs, style, vnodeConf.tagName)
      }

      applyChildren(vnodeConf, style)
    }

    return component
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

      if (haveStyleName(child)) {
        replaceStyleName(child.attrs, style, child.tagName)
      }

      applyChildren(child, style)
    }
  }
}

function replaceStyleName (attrs, style, tagName) {
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
        _.grassWarn(`"${styleName}" CSS module is undefined`, compName + `: <${tagName}/>`)
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

function haveStyleName (node) {
  return (
    node &&
    node.attrs &&
    node.attrs.styleName
  )
}