import * as _ from '../utils/index'

let compName

export default function CSSModules (styles) {
  return component => {
    if (!component || _.isEmptyObj(styles)) {
      return component
    }

    component.CSSModules = function (vnodeConf, _compName) {
      compName = _compName
      if (vnodeConf && vnodeConf.attrs) {
        replaceStyleName(vnodeConf.attrs, styles, vnodeConf.tagName)
      }
      applyChildren(vnodeConf, styles)
    }
    return component
  }
}

function applyChildren (config, styles) {
  if (!config) return

  const children = config.children

  if (children) {
    for (let i = 0, len = children.length; i < len; i++) {
      const child = children[i]
      if (child && child.attrs) {
        replaceStyleName(child.attrs, styles, child.tagName)
      }
      applyChildren(child, styles)
    }
  }
}

function replaceStyleName (attrs, styles, tagName) {
  let result = ''
  if (typeof attrs.styleName === 'string') {
    const styleNames = attrs.styleName.split(' ')

    for (let i = 0, len = styleNames.length; i < len; i++) {
      const name = styleNames[i]
      if (name && _.hasOwn(styles, name)) {
        const value = styles[name]
        result += !result ? value : ' ' + value
      } else if (name) {
        _.grassWarn(`"${name}" CSS module is undefined`, compName + `: <${tagName}/>`)
      }
    }
  }
  attrs.styleName = undefined
  mergeClassName(attrs, result)
}

function mergeClassName (attrs, classResult) {
  if (!attrs.className) {
    attrs.className = classResult
  } else if (classResult) {
    attrs.className += ' ' + classResult
  }
}