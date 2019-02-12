import * as _ from '../utils/index'

let compName

export default function CSSModules (styles) {
  return component => {
    if (component && !_.isEmptyObj(styles)) {
      component.$styles = styles
    }

    component.CSSModules = function (vnodeConf, _compName) {
      compName = _compName
      if (haveStyleName(vnodeConf)) {
        replaceStyleName(vnodeConf.attrs, styles, vnodeConf.tagName)
      }

      applyChildren(vnodeConf, styles)
    }

    return component
  }
}

function applyChildren (config, styles) {
  if (!config) {
    return
  }

  const children = config.children

  if (children) {
    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i]

      if (haveStyleName(child)) {
        replaceStyleName(child.attrs, styles, child.tagName)
      }

      applyChildren(child, styles)
    }
  }
}

function replaceStyleName (attrs, styles, tagName) {
  const styleString = attrs.styleName

  if (typeof styleString === 'string') {
    const styleNames = styleString.split(' ')
    let result = ''

    for (let i = 0, len = styleNames.length; i < len; i++) {
      const styleName = styleNames[i]

      if (styleName && _.hasOwn(styles, styleName)) {
        const value = styles[styleName]

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