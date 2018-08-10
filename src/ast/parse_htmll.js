import * as _ from '../utils'

// 匹配属性名
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

// 匹配标签名(包括 - )
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

// 匹配文本节点
const textRE = /[^<]*/
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/

// 匹配注释节点,doctype,ie hack节点
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!--/
const conditionalComment = /^<!\[/

// 匹配转义节点
const decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t'
}
const encodedAttr = /&(?:lt|gt|quot|amp);/g
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g

export const TEXT = 0 // 文本
export const STATICTAG = 1 // 静态节点
export const TAG = 2 // 元素节点

export function _createStaticNode (content, parent, index = null) {
  return {
    type: TEXT,
    start: index,
    parent,
    end: null,
    content,
    static: true,
  }
}