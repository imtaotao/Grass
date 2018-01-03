import * as _ from '../utils'

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!--/
const conditionalComment = /^<!\[/
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

export function parseHtml (html) {
  _.log(html)
  let ast = {}
  let index = 0
  const tag = parseStartTag()
  const end = parseEndTag()
  console.log(tag)


  // 获取开始标签
  function parseStartTag () {
  	const startTag = html.match(startTagOpen)
  	const content = startTag[0]
  	const tagName = startTag[1]
  	advance(content.length)
  	return {
  		i: index - 1,
  		tagName,
  		content,
  		children: []
  	}
  }

  function parseEndTag () {
  	const end = html.match(endTag)
  	console.log(end)
  }

  // 跟新 html 字符串
	function advance (n) {
		index += n
		html = html.substring(n)
	}
}