var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function typeOf(val) {
  return Object.prototype.toString.call(val);
}
function isString(str) {
  return typeOf(str) === '[object String]';
}
function isPlainObject(obj) {
  return typeOf(obj) === '[object Object]';
}
function isFunction(fun) {
  return typeOf(fun) === '[object Function]';
}
function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number' || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol' || typeof value === 'boolean';
}
function isGeneratorFunction(fun) {
  var constructor = fun.constructor;
  if (!constructor) return false;
  if (constructor.name === 'GeneratorFunction' || constructor.displayName === 'GeneratorFunction') {
    return true;
  }
  var prototype = constructor.prototype;
  return typeof prototype.next === 'function' && typeof prototype.throw === 'function';
}

function each(arr, cb) {
  var i = 0;
  if (Array.isArray(arr) || arr.length) {
    var length = arr.length;
    for (; i < length; i++) {
      if (cb(arr[i], i) === false) return;
    }
    return;
  }
  if (isPlainObject(arr)) {
    var keyName = Object.keys(arr);
    var _length = keyName.length;
    for (; i < _length; i++) {
      if (cb(arr[keyName[i]], keyName[i]) === false) {
        return;
      }
    }
  }
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
function toString(val) {
  return val == null ? '' : (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? JSON.stringify(val, null, 2) : String(val);
}
function isEmptyObj(obj) {
  for (var val in obj) {
    return false;
  }
  return true;
}
function setOnlyReadAttr(obj, key, val) {
  Object.defineProperty(obj, key, {
    get: function get$$1() {
      return val;
    }
  });
}
function isUndef(val) {
  return val === undefined || val === null;
}
function warn(msg, noError) {
  var errorInfor = '[Grass tip]: ' + msg;
  if (noError) {
    console.warn(errorInfor);
    return;
  }
  throw Error(errorInfor);
}

var scope = null;
var chain = [scope];
function create(s) {
  if (s) {
    Object.setPrototypeOf(s, scope);
    chain.push(s);
    return s;
  }
  scope = Object.create(scope);
  chain.push(scope);
  return scope;
}
function add(key, val) {
  if (typeof key !== 'string') {
    warn('The variable name of the "for" scope must be a "string"');
    return;
  }
  scope[key] = val;
}
function destroy() {
  if (scope === null) {
    return scope;
  }
  chain.pop();
  scope = chain[chain.length - 1];
  return scope;
}
function getScope() {
  return scope;
}
function insertChain(obj) {
  if (!isLegScope(obj)) {
    warn('Insert "scope" must be a "object"');
    return;
  }
  if (scope === null) return obj;
  var ancestor = chain[1];
  if (obj !== ancestor) {
    Object.setPrototypeOf(ancestor, obj);
    chain.splice(1, 0, obj);
  }
  return scope;
}
function resetScope() {
  scope = null;
  chain = [scope];
}
function isLegScope(obj) {
  if (isPlainObject(obj)) {
    var prototype = Object.getPrototypeOf(obj);
    return prototype === null || prototype === Object.prototype;
  }
  return false;
}
var scope$1 = {
  add: add,
  create: create,
  destroy: destroy,
  getScope: getScope,
  resetScope: resetScope,
  insertChain: insertChain
};

function runExecuteContext(runCode, directName, tagName, comp, callback) {
  var noStateComp = comp.noStateComp,
      state = comp.state,
      props = comp.props;

  var insertScope = noStateComp ? props : state;
  var realData = scope$1.insertChain(insertScope || {});
  if (directName !== '{{ }}') {
    directName = 'v-' + directName;
  }
  return run(runCode, directName, tagName, comp, callback, realData);
}
function run(runCode, directName, tagName, comp, callback, state) {
  try {
    var fun = new Function('$obj_', '$callback_', '$scope_', runCode);
    return fun.call(comp, state, callback, scope$1);
  } catch (error) {
    warn('Component directive compilation error  \n\n  "' + directName + '":  ' + error + '\n\n\n    --->  ' + comp.name + ': <' + (tagName || '') + '/>\n');
  }
}

var styleString = /\{[^\}]*\}/;
function bind(props, comp, vnodeConf$$1) {
  if (!Array.isArray(props)) {
    dealSingleBindAttr(props, comp, vnodeConf$$1);
    return;
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prop = _step.value;

      dealSingleBindAttr(prop, comp, vnodeConf$$1);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (isReservedTag(vnodeConf$$1.tagName)) {
    modifyOrdinayAttrAsLibAttr(vnodeConf$$1);
  }
}
function dealSingleBindAttr(_ref, comp, vnodeConf$$1) {
  var attrName = _ref.attrName,
      value = _ref.value;

  if (attrName === 'style') {
    if (!styleString.test(value)) {
      vnodeConf$$1.attrs.style = spliceStyleStr(vnodeConf$$1.attrs[attrName], value);
      return;
    }
    vnodeConf$$1.attrs.style = spliceStyleStr(vnodeConf$$1.attrs[attrName], getFormatStyle(getValue()));
    return;
  }
  vnodeConf$$1.attrs[attrName] = comp ? getValue() : value;
  function getValue() {
    return runExecuteContext('with($obj_) { return ' + value + '; }', 'bind', vnodeConf$$1.tagName, comp);
  }
}
function getNormalStyleKey(key) {
  return key.replace(/[A-Z]/g, function (k1) {
    return '-' + k1.toLocaleLowerCase();
  });
}
function getFormatStyle(v) {
  var result = '';
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Object.keys(v)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var key = _step2.value;

      result += getNormalStyleKey(key) + ': ' + v[key] + ';';
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return result;
}
function spliceStyleStr(o, n) {
  if (!o) return n;
  if (o[o.length - 1] === ';') return o + n;
  return o + ';' + n;
}

var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
var startTagOpen = new RegExp('^<' + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
var textREG = /[^<]*/;
var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/;
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;
var TEXT = 0;
var STATICTAG = 1;
var TAG = 2;
function parseTemplate(html, compName) {
  var index = 0;
  var searchEndCount = 0;
  var ast = [];
  var scope = ast;
  filter();
  while (html) {
    searchEndCount++;
    parseStart();
    parseEnd();
    if (searchEndCount > html.length / 4) {
      warn('Parsing template error\n\n   Missing end tag  \n\n  ---> ' + compName + '\n');
    }
  }
  return ast[0];
  function parseStart() {
    var match = html.match(startTagOpen);
    if (match && match[0]) {
      var tagStr = match[0];
      var tagName = match[1];
      var tagNode = createTag(tagName, scope === ast ? null : scope);
      if (scope !== ast) {
        scope.children.push(tagNode);
      } else {
        ast.push(tagNode);
      }
      scope = tagNode;
      advance(tagStr.length);
      var end = void 0,
          attr = void 0,
          attrName = void 0,
          attrValue = void 0;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        attrName = attr[1];
        attrValue = attr[3] || attr[4] || attr[5];
        if (/^v-|@|:+/.test(attrName)) {
          conversionDirection(defineProperty({}, attrName, attrValue));
        } else {
          scope.attrs[attrName] = attrValue;
        }
      }
      if (end[1]) {
        scope.isUnaryTag = true;
        scope.end = index;
        scope = scope.parent;
        searchEndCount = 0;
      } else {
        scope.isUnaryTag = false;
      }
      advance(end[0].length);
      while (parseStaticTag()) {}
    }
  }
  function parseStaticTag() {
    filter();
    var match = html.match(textREG);
    var text = void 0;
    if (!match || !match[0]) return false;
    if (match && (text = match[0])) {
      if (!defaultTagRE.test(text)) {
        var textNode = createStaticNode(text, scope);
        advance(text.length);
        textNode.end = index;
        if (scope === null) {
          warn('Component can only have one root node \n\n  --->  ' + compName + '\n');
        }
        scope.children.push(textNode);
      } else {
        var expression = parseTextExpression(text);
        var staticTag = createStaticTag(text, expression, scope);
        advance(text.length);
        staticTag.end = index;
        scope.children.push(staticTag);
      }
    }
    return true;
  }
  function parseTextExpression(text) {
    var l = 0;
    var first = true;
    var match = null;
    var resultText = '';
    var reg = new RegExp(defaultTagRE, 'g');
    while (match = reg.exec(text)) {
      resultText += first ? '`' + text.slice(l, match.index) + '` + _s(' + match[1] + ') ' : '+ `' + text.slice(l, match.index) + '` + _s(' + match[1] + ') ';
      l = match.index + match[0].length;
      first && (first = false);
    }
    if (l === text.length) return resultText;
    resultText += '+ `' + text.slice(l, text.length) + '`';
    return resultText;
  }
  function parseEnd() {
    var match = html.match(endTag);
    if (match && match[0]) {
      var _match = slicedToArray(match, 2),
          tagStr = _match[0],
          tagName = _match[1];

      if (scope.type === TAG && scope.tagName === tagName) {
        searchEndCount = 0;
        advance(tagStr.length);
        scope.end = index;
        scope = scope.parent;
        while (parseStaticTag()) {}
      }
    }
  }
  function filter() {
    if (comment.test(html)) {
      var commentEnd = html.indexOf('-->');
      if (commentEnd >= 0) {
        advance(commentEnd + 3);
      }
    }
    if (conditionalComment.test(html)) {
      var conditionalEnd = html.indexOf(']>');
      if (conditionalEnd >= 0) {
        advance(conditionalEnd + 2);
      }
    }
    var doctypeMatch = html.match(doctype);
    if (doctypeMatch) {
      advance(doctypeMatch[0].length);
    }
  }
  function advance(n) {
    index += n;
    html = html.substring(n);
  }
  function getForArgs(attr) {
    var args = /((\w+)|(\([^\(]+\)))\s+of\s+([\w\.\(\)\[\]]+)/g.exec(attr['v-for']);
    if (args) {
      var key = args[1];
      if (key.includes(',')) {
        key = key.replace(/[\(\)]/g, '').split(',').map(function (val) {
          return val.trim();
        });
      }
      return {
        key: key,
        data: args[4],
        isMultiple: Array.isArray(key)
      };
    }
    return null;
  }
  function conversionDirection(vAttr) {
    var bind = void 0,
        on = void 0;
    var key = Object.keys(vAttr)[0];
    if (key === 'v-for' && vAttr[key]) {
      var args = getForArgs(vAttr);
      scope.forMultipleArg = Array.isArray(args);
      scope.forArgs = args;
      scope.for = true;
    }
    if (key === 'v-if') {
      scope.if = true;
    }
    if (bind = key.match(/^(:)(.+)/)) {
      vAttr = defineProperty({}, 'v-bind' + key, vAttr[key]);
    }
    if (on = key.match(/^@(.+)/)) {
      vAttr = defineProperty({}, 'v-on:' + on[1], vAttr[key]);
    }
    scope.direction.push(vAttr);
  }
  function createTag(tagName, parent) {
    var root = parent ? false : true;
    return {
      type: TAG,
      tagName: tagName,
      bindState: [],
      children: [],
      attrs: {},
      start: index,
      end: null,
      parent: parent,
      root: root,
      isUnaryTag: null,
      direction: [],
      hasBindings: function hasBindings() {
        return !!this.direction.length;
      }
    };
  }
  function createStaticTag(content, expression, parent) {
    return {
      type: STATICTAG,
      start: index,
      bindState: [],
      parent: parent,
      end: null,
      expression: expression,
      content: content
    };
  }
  function createStaticNode(content, parent) {
    return {
      type: TEXT,
      start: index,
      parent: parent,
      end: null,
      content: content,
      static: true
    };
  }
}

function makeMap(str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? function (val) {
    return map[val.toLowerCase()];
  } : function (val) {
    return map[val];
  };
}
function sendDirectWarn(direct, compName) {
  warn('Cannot make "' + direct + '" directives on the root node of a component\uFF0C\n  Maybe you can specify the "' + direct + '" command on "<' + compName + ' ' + direct + '="xxx" />"\n    \n\n  ---> ' + compName + '\n');
}
function deepClone(obj, similarArr) {
  var res = void 0;
  if (isPlainObject(obj)) {
    res = new obj.constructor();
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var val = obj[keys[i]];
      if (val === obj) continue;
      res[keys[i]] = canUse(val) ? val : deepClone(val, similarArr);
    }
    return res;
  }
  if (Array.isArray(obj) || similarArr) {
    res = new obj.constructor();
    for (var _i = 0; _i < obj.length; _i++) {
      var _val = obj[_i];
      if (_val === obj) continue;
      res[_i] = canUse(_val) ? _val : deepClone(_val, similarArr);
    }
    return res;
  }
  function canUse(val) {
    return isPrimitive(val) || val == null || typeof val === 'function';
  }
  return obj;
}
function vnodeConf(astNode, parent) {
  if (astNode.type === TAG) {
    var tagName = astNode.tagName,
        attrs = astNode.attrs,
        direction = astNode.direction;

    var _attrs = deepClone(attrs);
    var _direction = deepClone(direction);
    var _children = [];
    return vTag(tagName, _attrs, _direction, _children, parent);
  }
  return vText(astNode.content, parent);
}
function vTag(tagName, attrs, direction, children, parent) {
  var node = Object.create(null);
  node.type = TAG;
  node.attrs = attrs;
  node.parent = parent;
  node.tagName = tagName;
  node.children = children;
  node.direction = direction;
  return node;
}
function vText(content, parent) {
  var node = Object.create(null);
  node.type = TEXT;
  node.parent = parent;
  node.content = content;
  return node;
}
function removeChild(parent, child, notOnly) {
  var children = parent.children;
  for (var i = 0; i < children.length; i++) {
    if (children[i] === child) {
      children[i] = null;
      if (!notOnly) return;
    }
  }
}
var filterAttr = {
  'namespace': 1,
  'className': 1,
  'styleName': 1,
  'style': 1,
  'class': 1,
  'key': 1,
  'id': 1
};
function isFilter(key) {
  return filterAttr[key] || key.slice(0, 2) === 'on';
}
function modifyOrdinayAttrAsLibAttr(node) {
  if (!node.attrs) return;
  var keyWord = 'attributes';
  var attrs = node.attrs;
  var originAttr = attrs[keyWord];
  var keys = Object.keys(attrs);
  attrs[keyWord] = Object.create(null);
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    if (isFilter(key)) continue;
    attrs[keyWord][key] = attrs[key];
    if (key !== keyWord) {
      attrs[key] = undefined;
    }
  }
  if (originAttr) {
    attrs[keyWord][keyWord] = originAttr;
  }
}
function migrateCompStatus(outputNode, acceptNode) {
  if (!outputNode || !acceptNode) return;
  if (hasOwn(outputNode, 'vTextResult')) {
    var res = outputNode['vTextResult'];
    acceptNode.children.unshift(vText(toString(res), acceptNode));
  }
  if (hasOwn(outputNode, 'vShowResult')) {
    var _res = outputNode['vShowResult'];
    bind(_res, null, acceptNode);
  }
  if (hasOwn(outputNode.attrs, 'className')) {
    var outputClassName = outputNode.attrs['className'];
    var acceptClassName = acceptNode.attrs['className'];
    if (acceptClassName) {
      acceptNode.attrs['className'] = outputClassName + ' ' + acceptClassName;
    } else {
      acceptNode.attrs['className'] = outputClassName;
    }
  }
}
var filterPropsList = {
  'key': 1
};
function getProps(attrs, requireList, compName) {
  var props = Object.create(null);
  if (!attrs) return props;
  var keys = Object.keys(attrs);
  var index = null;
  for (var i = 0; i < keys.length; i++) {
    if (filterPropsList[keys[i]]) continue;
    var key = keys[i];
    var val = attrs[key];
    if (!requireList) {
      props[key] = val;
    } else if (requireList && ~(index = requireList.indexOf(key))) {
      props[key] = val;
      requireList.splice(index, 1);
    }
  }
  if (requireList && requireList.length) {
    for (var j = 0; j < requireList.length; j++) {
      warn('Parent component does not pass "' + requireList[j] + '" attribute  \n\n    --->  ' + compName + '\n', true);
    }
  }
  return props;
}
function isClass(fun) {
  var proto = fun.prototype;
  if (!proto || isGeneratorFunction(fun)) {
    return false;
  }
  if (isEmptyObj(proto)) {
    var _constructor = proto.constructor;
    if (_constructor && _constructor === fun) {
      var descriptors = Object.getOwnPropertyDescriptors(proto);
      return Object.keys(descriptors).length > 1 ? true : false;
    }
    return true;
  }
  return true;
}

var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot');
var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);
function isReservedTag(tag) {
  return isHTMLTag(tag) || isSVG(tag);
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var slice = Array.prototype.slice;
var domWalk = iterativelyWalk;
function iterativelyWalk(nodes, cb) {
    if (!('length' in nodes)) {
        nodes = [nodes];
    }
    nodes = slice.call(nodes);
    while(nodes.length) {
        var node = nodes.shift(),
            ret = cb(node);
        if (ret) {
            return ret
        }
        if (node.childNodes && node.childNodes.length) {
            nodes = slice.call(node.childNodes).concat(nodes);
        }
    }
}

var domComment = Comment;
function Comment(data, owner) {
    if (!(this instanceof Comment)) {
        return new Comment(data, owner)
    }
    this.data = data;
    this.nodeValue = data;
    this.length = data.length;
    this.ownerDocument = owner || null;
}
Comment.prototype.nodeType = 8;
Comment.prototype.nodeName = "#comment";
Comment.prototype.toString = function _Comment_toString() {
    return "[object Comment]"
};

var domText = DOMText;
function DOMText(value, owner) {
    if (!(this instanceof DOMText)) {
        return new DOMText(value)
    }
    this.data = value || "";
    this.length = this.data.length;
    this.ownerDocument = owner || null;
}
DOMText.prototype.type = "DOMTextNode";
DOMText.prototype.nodeType = 3;
DOMText.prototype.nodeName = "#text";
DOMText.prototype.toString = function _Text_toString() {
    return this.data
};
DOMText.prototype.replaceData = function replaceData(index, length, value) {
    var current = this.data;
    var left = current.substring(0, index);
    var right = current.substring(index + length, current.length);
    this.data = left + value + right;
    this.length = this.data.length;
};

var dispatchEvent_1 = dispatchEvent;
function dispatchEvent(ev) {
    var elem = this;
    var type = ev.type;
    if (!ev.target) {
        ev.target = elem;
    }
    if (!elem.listeners) {
        elem.listeners = {};
    }
    var listeners = elem.listeners[type];
    if (listeners) {
        return listeners.forEach(function (listener) {
            ev.currentTarget = elem;
            if (typeof listener === 'function') {
                listener(ev);
            } else {
                listener.handleEvent(ev);
            }
        })
    }
    if (elem.parentNode) {
        elem.parentNode.dispatchEvent(ev);
    }
}

var addEventListener_1 = addEventListener;
function addEventListener(type, listener) {
    var elem = this;
    if (!elem.listeners) {
        elem.listeners = {};
    }
    if (!elem.listeners[type]) {
        elem.listeners[type] = [];
    }
    if (elem.listeners[type].indexOf(listener) === -1) {
        elem.listeners[type].push(listener);
    }
}

var removeEventListener_1 = removeEventListener;
function removeEventListener(type, listener) {
    var elem = this;
    if (!elem.listeners) {
        return
    }
    if (!elem.listeners[type]) {
        return
    }
    var list = elem.listeners[type];
    var index = list.indexOf(listener);
    if (index !== -1) {
        list.splice(index, 1);
    }
}

var serialize = serializeNode;
var voidElements = ["area","base","br","col","embed","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"];
function serializeNode(node) {
    switch (node.nodeType) {
        case 3:
            return escapeText(node.data)
        case 8:
            return "<!--" + node.data + "-->"
        default:
            return serializeElement(node)
    }
}
function serializeElement(elem) {
    var strings = [];
    var tagname = elem.tagName;
    if (elem.namespaceURI === "http://www.w3.org/1999/xhtml") {
        tagname = tagname.toLowerCase();
    }
    strings.push("<" + tagname + properties(elem) + datasetify(elem));
    if (voidElements.indexOf(tagname) > -1) {
        strings.push(" />");
    } else {
        strings.push(">");
        if (elem.childNodes.length) {
            strings.push.apply(strings, elem.childNodes.map(serializeNode));
        } else if (elem.textContent || elem.innerText) {
            strings.push(escapeText(elem.textContent || elem.innerText));
        } else if (elem.innerHTML) {
            strings.push(elem.innerHTML);
        }
        strings.push("</" + tagname + ">");
    }
    return strings.join("")
}
function isProperty(elem, key) {
    var type = typeof elem[key];
    if (key === "style" && Object.keys(elem.style).length > 0) {
      return true
    }
    return elem.hasOwnProperty(key) &&
        (type === "string" || type === "boolean" || type === "number") &&
        key !== "nodeName" && key !== "className" && key !== "tagName" &&
        key !== "textContent" && key !== "innerText" && key !== "namespaceURI" &&  key !== "innerHTML"
}
function stylify(styles) {
    if (typeof styles === 'string') return styles
    var attr = "";
    Object.keys(styles).forEach(function (key) {
        var value = styles[key];
        key = key.replace(/[A-Z]/g, function(c) {
            return "-" + c.toLowerCase();
        });
        attr += key + ":" + value + ";";
    });
    return attr
}
function datasetify(elem) {
    var ds = elem.dataset;
    var props = [];
    for (var key in ds) {
        props.push({ name: "data-" + key, value: ds[key] });
    }
    return props.length ? stringify(props) : ""
}
function stringify(list) {
    var attributes = [];
    list.forEach(function (tuple) {
        var name = tuple.name;
        var value = tuple.value;
        if (name === "style") {
            value = stylify(value);
        }
        attributes.push(name + "=" + "\"" + escapeAttributeValue(value) + "\"");
    });
    return attributes.length ? " " + attributes.join(" ") : ""
}
function properties(elem) {
    var props = [];
    for (var key in elem) {
        if (isProperty(elem, key)) {
            props.push({ name: key, value: elem[key] });
        }
    }
    for (var ns in elem._attributes) {
      for (var attribute in elem._attributes[ns]) {
        var prop = elem._attributes[ns][attribute];
        var name = (prop.prefix ? prop.prefix + ":" : "") + attribute;
        props.push({ name: name, value: prop.value });
      }
    }
    if (elem.className) {
        props.push({ name: "class", value: elem.className });
    }
    return props.length ? stringify(props) : ""
}
function escapeText(s) {
    var str = '';
    if (typeof(s) === 'string') {
        str = s;
    } else if (s) {
        str = s.toString();
    }
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
}
function escapeAttributeValue(str) {
    return escapeText(str).replace(/"/g, "&quot;")
}

var htmlns = "http://www.w3.org/1999/xhtml";
var domElement = DOMElement;
function DOMElement(tagName, owner, namespace) {
    if (!(this instanceof DOMElement)) {
        return new DOMElement(tagName)
    }
    var ns = namespace === undefined ? htmlns : (namespace || null);
    this.tagName = ns === htmlns ? String(tagName).toUpperCase() : tagName;
    this.nodeName = this.tagName;
    this.className = "";
    this.dataset = {};
    this.childNodes = [];
    this.parentNode = null;
    this.style = {};
    this.ownerDocument = owner || null;
    this.namespaceURI = ns;
    this._attributes = {};
    if (this.tagName === 'INPUT') {
      this.type = 'text';
    }
}
DOMElement.prototype.type = "DOMElement";
DOMElement.prototype.nodeType = 1;
DOMElement.prototype.appendChild = function _Element_appendChild(child) {
    if (child.parentNode) {
        child.parentNode.removeChild(child);
    }
    this.childNodes.push(child);
    child.parentNode = this;
    return child
};
DOMElement.prototype.replaceChild =
    function _Element_replaceChild(elem, needle) {
        if (elem.parentNode) {
            elem.parentNode.removeChild(elem);
        }
        var index = this.childNodes.indexOf(needle);
        needle.parentNode = null;
        this.childNodes[index] = elem;
        elem.parentNode = this;
        return needle
    };
DOMElement.prototype.removeChild = function _Element_removeChild(elem) {
    var index = this.childNodes.indexOf(elem);
    this.childNodes.splice(index, 1);
    elem.parentNode = null;
    return elem
};
DOMElement.prototype.insertBefore =
    function _Element_insertBefore(elem, needle) {
        if (elem.parentNode) {
            elem.parentNode.removeChild(elem);
        }
        var index = needle === null || needle === undefined ?
            -1 :
            this.childNodes.indexOf(needle);
        if (index > -1) {
            this.childNodes.splice(index, 0, elem);
        } else {
            this.childNodes.push(elem);
        }
        elem.parentNode = this;
        return elem
    };
DOMElement.prototype.setAttributeNS =
    function _Element_setAttributeNS(namespace, name, value) {
        var prefix = null;
        var localName = name;
        var colonPosition = name.indexOf(":");
        if (colonPosition > -1) {
            prefix = name.substr(0, colonPosition);
            localName = name.substr(colonPosition + 1);
        }
        if (this.tagName === 'INPUT' && name === 'type') {
          this.type = value;
        }
        else {
          var attributes = this._attributes[namespace] || (this._attributes[namespace] = {});
          attributes[localName] = {value: value, prefix: prefix};
        }
    };
DOMElement.prototype.getAttributeNS =
    function _Element_getAttributeNS(namespace, name) {
        var attributes = this._attributes[namespace];
        var value = attributes && attributes[name] && attributes[name].value;
        if (this.tagName === 'INPUT' && name === 'type') {
          return this.type;
        }
        if (typeof value !== "string") {
            return null
        }
        return value
    };
DOMElement.prototype.removeAttributeNS =
    function _Element_removeAttributeNS(namespace, name) {
        var attributes = this._attributes[namespace];
        if (attributes) {
            delete attributes[name];
        }
    };
DOMElement.prototype.hasAttributeNS =
    function _Element_hasAttributeNS(namespace, name) {
        var attributes = this._attributes[namespace];
        return !!attributes && name in attributes;
    };
DOMElement.prototype.setAttribute = function _Element_setAttribute(name, value) {
    return this.setAttributeNS(null, name, value)
};
DOMElement.prototype.getAttribute = function _Element_getAttribute(name) {
    return this.getAttributeNS(null, name)
};
DOMElement.prototype.removeAttribute = function _Element_removeAttribute(name) {
    return this.removeAttributeNS(null, name)
};
DOMElement.prototype.hasAttribute = function _Element_hasAttribute(name) {
    return this.hasAttributeNS(null, name)
};
DOMElement.prototype.removeEventListener = removeEventListener_1;
DOMElement.prototype.addEventListener = addEventListener_1;
DOMElement.prototype.dispatchEvent = dispatchEvent_1;
DOMElement.prototype.focus = function _Element_focus() {
    return void 0
};
DOMElement.prototype.toString = function _Element_toString() {
    return serialize(this)
};
DOMElement.prototype.getElementsByClassName = function _Element_getElementsByClassName(classNames) {
    var classes = classNames.split(" ");
    var elems = [];
    domWalk(this, function (node) {
        if (node.nodeType === 1) {
            var nodeClassName = node.className || "";
            var nodeClasses = nodeClassName.split(" ");
            if (classes.every(function (item) {
                return nodeClasses.indexOf(item) !== -1
            })) {
                elems.push(node);
            }
        }
    });
    return elems
};
DOMElement.prototype.getElementsByTagName = function _Element_getElementsByTagName(tagName) {
    tagName = tagName.toLowerCase();
    var elems = [];
    domWalk(this.childNodes, function (node) {
        if (node.nodeType === 1 && (tagName === '*' || node.tagName.toLowerCase() === tagName)) {
            elems.push(node);
        }
    });
    return elems
};
DOMElement.prototype.contains = function _Element_contains(element) {
    return domWalk(this, function (node) {
        return element === node
    }) || false
};

var domFragment = DocumentFragment;
function DocumentFragment(owner) {
    if (!(this instanceof DocumentFragment)) {
        return new DocumentFragment()
    }
    this.childNodes = [];
    this.parentNode = null;
    this.ownerDocument = owner || null;
}
DocumentFragment.prototype.type = "DocumentFragment";
DocumentFragment.prototype.nodeType = 11;
DocumentFragment.prototype.nodeName = "#document-fragment";
DocumentFragment.prototype.appendChild  = domElement.prototype.appendChild;
DocumentFragment.prototype.replaceChild = domElement.prototype.replaceChild;
DocumentFragment.prototype.removeChild  = domElement.prototype.removeChild;
DocumentFragment.prototype.toString =
    function _DocumentFragment_toString() {
        return this.childNodes.map(function (node) {
            return String(node)
        }).join("")
    };

var event = Event;
function Event(family) {}
Event.prototype.initEvent = function _Event_initEvent(type, bubbles, cancelable) {
    this.type = type;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
};
Event.prototype.preventDefault = function _Event_preventDefault() {
};

var document$1 = Document;
function Document() {
    if (!(this instanceof Document)) {
        return new Document();
    }
    this.head = this.createElement("head");
    this.body = this.createElement("body");
    this.documentElement = this.createElement("html");
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
    this.childNodes = [this.documentElement];
    this.nodeType = 9;
}
var proto = Document.prototype;
proto.createTextNode = function createTextNode(value) {
    return new domText(value, this)
};
proto.createElementNS = function createElementNS(namespace, tagName) {
    var ns = namespace === null ? null : String(namespace);
    return new domElement(tagName, this, ns)
};
proto.createElement = function createElement(tagName) {
    return new domElement(tagName, this)
};
proto.createDocumentFragment = function createDocumentFragment() {
    return new domFragment(this)
};
proto.createEvent = function createEvent(family) {
    return new event(family)
};
proto.createComment = function createComment(data) {
    return new domComment(data, this)
};
proto.getElementById = function getElementById(id) {
    id = String(id);
    var result = domWalk(this.childNodes, function (node) {
        if (String(node.id) === id) {
            return node
        }
    });
    return result || null
};
proto.getElementsByClassName = domElement.prototype.getElementsByClassName;
proto.getElementsByTagName = domElement.prototype.getElementsByTagName;
proto.contains = domElement.prototype.contains;
proto.removeEventListener = removeEventListener_1;
proto.addEventListener = addEventListener_1;
proto.dispatchEvent = dispatchEvent_1;

var minDocument = new document$1();

var topLevel = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal :
    typeof window !== 'undefined' ? window : {};

var doccy;
if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];
    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDocument;
    }
}
var document_1 = doccy;

var isObject$1 = function isObject(x) {
	return typeof x === "object" && x !== null;
};

var isVhook = isHook;
function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

var applyProperties_1 = applyProperties;
function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName];
        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isVhook(propValue)) {
            removeProperty(node, propName, propValue, previous);
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined);
            }
        } else {
            if (isObject$1(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue;
            }
        }
    }
}
function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName];
        if (!isVhook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName);
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = "";
                }
            } else if (typeof previousValue === "string") {
                node[propName] = "";
            } else {
                node[propName] = null;
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue);
        }
    }
}
function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined;
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName];
            if (attrValue === undefined) {
                node.removeAttribute(attrName);
            } else {
                node.setAttribute(attrName, attrValue);
            }
        }
        return
    }
    if(previousValue && isObject$1(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue;
        return
    }
    if (!isObject$1(node[propName])) {
        node[propName] = {};
    }
    var replacer = propName === "style" ? "" : undefined;
    for (var k in propValue) {
        var value = propValue[k];
        node[propName][k] = (value === undefined) ? replacer : value;
    }
}
function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

var version = "2";

var isVnode = isVirtualNode;
function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

var isVtext = isVirtualText;
function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

var isWidget_1 = isWidget;
function isWidget(w) {
    return w && w.type === "Widget"
}

var isThunk_1 = isThunk;
function isThunk(t) {
    return t && t.type === "Thunk"
}

var handleThunk_1 = handleThunk;
function handleThunk(a, b) {
    var renderedA = a;
    var renderedB = b;
    if (isThunk_1(b)) {
        renderedB = renderThunk(b, a);
    }
    if (isThunk_1(a)) {
        renderedA = renderThunk(a, null);
    }
    return {
        a: renderedA,
        b: renderedB
    }
}
function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode;
    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous);
    }
    if (!(isVnode(renderedThunk) ||
            isVtext(renderedThunk) ||
            isWidget_1(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }
    return renderedThunk
}

var Container = function () {
  function Container(val) {
    classCallCheck(this, Container);

    this._value = val;
  }

  createClass(Container, [{
    key: 'pipe',
    value: function pipe(fun) {
      return Container.of(fun(this._value));
    }
  }, {
    key: 'safePipe',
    value: function safePipe(fun) {
      return isUndef(this._value) ? Container.of(null) : Container.of(fun(this._value));
    }
  }, {
    key: 'maybe',
    value: function maybe(fun) {
      return fun ? fun(this._value) : this._value;
    }
  }], [{
    key: 'of',
    value: function of(val) {
      return new Container(val);
    }
  }]);
  return Container;
}();

var directContainer = Object.create(null);
function customDirective(direct, callback) {
  directContainer['v-' + direct] = Container.of(callback);
  return this;
}
function haveRegisteredCustomDirect(key) {
  return hasOwn(directContainer, key);
}
function elementCreated(comp, dom, direaction) {
  if (!direaction || isEmptyObj(direaction)) return;
  var keys = Object.keys(direaction);

  var _loop = function _loop(i, len) {
    var key = keys[i];
    var val = directContainer[key];
    val.safePipe(function (callback) {
      callback(comp, dom, direaction[key]);
    });
  };

  for (var i = 0, len = keys.length; i < len; i++) {
    _loop(i, len);
  }
}

var nativeIsArray = Array.isArray;
var toString$1 = Object.prototype.toString;
var xIsArray = nativeIsArray || isArray;
function isArray(obj) {
    return toString$1.call(obj) === "[object Array]"
}

VirtualPatch.NONE = 0;
VirtualPatch.VTEXT = 1;
VirtualPatch.VNODE = 2;
VirtualPatch.WIDGET = 3;
VirtualPatch.PROPS = 4;
VirtualPatch.ORDER = 5;
VirtualPatch.INSERT = 6;
VirtualPatch.REMOVE = 7;
VirtualPatch.THUNK = 8;
var vpatch = VirtualPatch;
function VirtualPatch(type, vNode, patch) {
    this.type = Number(type);
    this.vNode = vNode;
    this.patch = patch;
}
VirtualPatch.prototype.version = version;
VirtualPatch.prototype.type = "VirtualPatch";

var diffProps_1 = diffProps;
function diffProps(a, b) {
    var diff;
    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {};
            diff[aKey] = undefined;
        }
        var aValue = a[aKey];
        var bValue = b[aKey];
        if (aValue === bValue) {
            continue
        } else if (isObject$1(aValue) && isObject$1(bValue)) {
            if (getPrototype$1(bValue) !== getPrototype$1(aValue)) {
                diff = diff || {};
                diff[aKey] = bValue;
            } else if (isVhook(bValue)) {
                 diff = diff || {};
                 diff[aKey] = bValue;
            } else {
                var objectDiff = diffProps(aValue, bValue);
                if (objectDiff) {
                    diff = diff || {};
                    diff[aKey] = objectDiff;
                }
            }
        } else {
            diff = diff || {};
            diff[aKey] = bValue;
        }
    }
    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {};
            diff[bKey] = b[bKey];
        }
    }
    return diff
}
function getPrototype$1(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

var diff_1 = diff;
function diff(a, b) {
    var patch = { a: a };
    walk(a, b, patch, 0);
    return patch
}
function walk(a, b, patch, index) {
    if (a === b) {
        return
    }
    var apply = patch[index];
    var applyClear = false;
    if (isThunk_1(a) || isThunk_1(b)) {
        thunks(a, b, patch, index);
    } else if (b == null) {
        if (!isWidget_1(a)) {
            clearState(a, patch, index);
            apply = patch[index];
        }
        apply = appendPatch(apply, new vpatch(vpatch.REMOVE, a, b));
    } else if (isVnode(b)) {
        if (isVnode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps_1(a.properties, b.properties);
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new vpatch(vpatch.PROPS, a, propsPatch));
                }
                apply = diffChildren(a, b, patch, apply, index);
            } else {
                apply = appendPatch(apply, new vpatch(vpatch.VNODE, a, b));
                applyClear = true;
            }
        } else {
            apply = appendPatch(apply, new vpatch(vpatch.VNODE, a, b));
            applyClear = true;
        }
    } else if (isVtext(b)) {
        if (!isVtext(a)) {
            apply = appendPatch(apply, new vpatch(vpatch.VTEXT, a, b));
            applyClear = true;
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new vpatch(vpatch.VTEXT, a, b));
        }
    } else if (isWidget_1(b)) {
        if (!isWidget_1(a)) {
            applyClear = true;
        }
        apply = appendPatch(apply, new vpatch(vpatch.WIDGET, a, b));
    }
    if (apply) {
        patch[index] = apply;
    }
    if (applyClear) {
        clearState(a, patch, index);
    }
}
function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children;
    var orderedSet = reorder(aChildren, b.children);
    var bChildren = orderedSet.children;
    var aLen = aChildren.length;
    var bLen = bChildren.length;
    var len = aLen > bLen ? aLen : bLen;
    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i];
        var rightNode = bChildren[i];
        index += 1;
        if (!leftNode) {
            if (rightNode) {
                apply = appendPatch(apply,
                    new vpatch(vpatch.INSERT, null, rightNode));
            }
        } else {
            walk(leftNode, rightNode, patch, index);
        }
        if (isVnode(leftNode) && leftNode.count) {
            index += leftNode.count;
        }
    }
    if (orderedSet.moves) {
        apply = appendPatch(apply, new vpatch(
            vpatch.ORDER,
            a,
            orderedSet.moves
        ));
    }
    return apply
}
function clearState(vNode, patch, index) {
    unhook(vNode, patch, index);
    destroyWidgets(vNode, patch, index);
}
function destroyWidgets(vNode, patch, index) {
    if (isWidget_1(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new vpatch(vpatch.REMOVE, vNode, null)
            );
        }
    } else if (isVnode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children;
        var len = children.length;
        for (var i = 0; i < len; i++) {
            var child = children[i];
            index += 1;
            destroyWidgets(child, patch, index);
            if (isVnode(child) && child.count) {
                index += child.count;
            }
        }
    } else if (isThunk_1(vNode)) {
        thunks(vNode, null, patch, index);
    }
}
function thunks(a, b, patch, index) {
    var nodes = handleThunk_1(a, b);
    var thunkPatch = diff(nodes.a, nodes.b);
    if (hasPatches(thunkPatch)) {
        patch[index] = new vpatch(vpatch.THUNK, null, thunkPatch);
    }
}
function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }
    return false
}
function unhook(vNode, patch, index) {
    if (isVnode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new vpatch(
                    vpatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            );
        }
        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children;
            var len = children.length;
            for (var i = 0; i < len; i++) {
                var child = children[i];
                index += 1;
                unhook(child, patch, index);
                if (isVnode(child) && child.count) {
                    index += child.count;
                }
            }
        }
    } else if (isThunk_1(vNode)) {
        thunks(vNode, null, patch, index);
    }
}
function undefinedKeys(obj) {
    var result = {};
    for (var key in obj) {
        result[key] = undefined;
    }
    return result
}
function reorder(aChildren, bChildren) {
    var bChildIndex = keyIndex(bChildren);
    var bKeys = bChildIndex.keys;
    var bFree = bChildIndex.free;
    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }
    var aChildIndex = keyIndex(aChildren);
    var aKeys = aChildIndex.keys;
    var aFree = aChildIndex.free;
    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }
    var newChildren = [];
    var freeIndex = 0;
    var freeCount = bFree.length;
    var deletedItems = 0;
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i];
        var itemIndex;
        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                itemIndex = bKeys[aItem.key];
                newChildren.push(bChildren[itemIndex]);
            } else {
                itemIndex = i - deletedItems++;
                newChildren.push(null);
            }
        } else {
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++];
                newChildren.push(bChildren[itemIndex]);
            } else {
                itemIndex = i - deletedItems++;
                newChildren.push(null);
            }
        }
    }
    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex];
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j];
        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                newChildren.push(newItem);
            }
        } else if (j >= lastFreeIndex) {
            newChildren.push(newItem);
        }
    }
    var simulate = newChildren.slice();
    var simulateIndex = 0;
    var removes = [];
    var inserts = [];
    var simulateItem;
    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k];
        simulateItem = simulate[simulateIndex];
        while (simulateItem === null && simulate.length) {
            removes.push(remove$1(simulate, simulateIndex, null));
            simulateItem = simulate[simulateIndex];
        }
        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove$1(simulate, simulateIndex, simulateItem.key));
                        simulateItem = simulate[simulateIndex];
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k});
                        }
                        else {
                            simulateIndex++;
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k});
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k});
                }
                k++;
            }
            else if (simulateItem && simulateItem.key) {
                removes.push(remove$1(simulate, simulateIndex, simulateItem.key));
            }
        }
        else {
            simulateIndex++;
            k++;
        }
    }
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex];
        removes.push(remove$1(simulate, simulateIndex, simulateItem && simulateItem.key));
    }
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }
    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}
function remove$1(arr, index, key) {
    arr.splice(index, 1);
    return {
        from: index,
        key: key
    }
}
function keyIndex(children) {
    var keys = {};
    var free = [];
    var length = children.length;
    for (var i = 0; i < length; i++) {
        var child = children[i];
        if (child.key) {
            keys[child.key] = i;
        } else {
            free.push(i);
        }
    }
    return {
        keys: keys,
        free: free
    }
}
function appendPatch(apply, patch) {
    if (apply) {
        if (xIsArray(apply)) {
            apply.push(patch);
        } else {
            apply = [apply, patch];
        }
        return apply
    } else {
        return patch
    }
}

var diff_1$1 = diff_1;

var createElement_1 = createElement;
function createElement(vnode, opts) {
    var doc = opts ? opts.document || document_1 : document_1;
    var warn = opts ? opts.warn : null;
    vnode = handleThunk_1(vnode).a;
    if (isWidget_1(vnode)) {
        return vnode.init()
    } else if (isVtext(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVnode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode);
        }
        return null
    }
    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName);
    var props = vnode.properties;
    applyProperties_1(node, props);
    var children = vnode.children;
    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts);
        if (childNode) {
            node.appendChild(childNode);
        }
    }
    return node
}

var noChild = {};
var domIndex_1 = domIndex;
function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending);
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}
function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {};
    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode;
        }
        var vChildren = tree.children;
        if (vChildren) {
            var childNodes = rootNode.childNodes;
            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1;
                var vChild = vChildren[i] || noChild;
                var nextIndex = rootIndex + (vChild.count || 0);
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex);
                }
                rootIndex = nextIndex;
            }
        }
    }
    return nodes
}
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }
    var minIndex = 0;
    var maxIndex = indices.length - 1;
    var currentIndex;
    var currentItem;
    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0;
        currentItem = indices[currentIndex];
        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1;
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1;
        } else {
            return true
        }
    }
    return false;
}
function ascending(a, b) {
    return a > b ? 1 : -1
}

var updateWidget_1 = updateWidget;
function updateWidget(a, b) {
    if (isWidget_1(a) && isWidget_1(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }
    return false
}

var patchOp = applyPatch;
function applyPatch(vpatch$$1, domNode, renderOptions) {
    var type = vpatch$$1.type;
    var vNode = vpatch$$1.vNode;
    var patch = vpatch$$1.patch;
    switch (type) {
        case vpatch.REMOVE:
            return removeNode(domNode, vNode)
        case vpatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case vpatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case vpatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case vpatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case vpatch.ORDER:
            reorderChildren(domNode, patch);
            return domNode
        case vpatch.PROPS:
            applyProperties_1(domNode, patch, vNode.properties);
            return domNode
        case vpatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}
function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode;
    if (parentNode) {
        parentNode.removeChild(domNode);
    }
    destroyWidget(domNode, vNode);
    return null
}
function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions);
    if (parentNode) {
        parentNode.appendChild(newNode);
    }
    return parentNode
}
function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode;
    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text);
        newNode = domNode;
    } else {
        var parentNode = domNode.parentNode;
        newNode = renderOptions.render(vText, renderOptions);
        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode);
        }
    }
    return newNode
}
function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget_1(leftVNode, widget);
    var newNode;
    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode;
    } else {
        newNode = renderOptions.render(widget, renderOptions);
    }
    var parentNode = domNode.parentNode;
    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode);
    }
    if (!updating) {
        destroyWidget(domNode, leftVNode);
    }
    return newNode
}
function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode;
    var newNode = renderOptions.render(vNode, renderOptions);
    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode);
    }
    return newNode
}
function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget_1(w)) {
        w.destroy(domNode);
    }
}
function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes;
    var keyMap = {};
    var node;
    var remove;
    var insert;
    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i];
        node = childNodes[remove.from];
        if (remove.key) {
            keyMap[remove.key] = node;
        }
        domNode.removeChild(node);
    }
    var length = childNodes.length;
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j];
        node = keyMap[insert.key];
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to]);
    }
}
function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot);
    }
    return newRoot;
}

var patch_1 = patch;
function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {};
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive;
    renderOptions.render = renderOptions.render || createElement_1;
    return renderOptions.patch(rootNode, patches, renderOptions)
}
function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches);
    if (indices.length === 0) {
        return rootNode
    }
    var index = domIndex_1(rootNode, patches.a, indices);
    var ownerDocument = rootNode.ownerDocument;
    if (!renderOptions.document && ownerDocument !== document_1) {
        renderOptions.document = ownerDocument;
    }
    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i];
        rootNode = applyPatch$1(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions);
    }
    return rootNode
}
function applyPatch$1(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }
    var newNode;
    if (xIsArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions);
            if (domNode === rootNode) {
                rootNode = newNode;
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions);
        if (domNode === rootNode) {
            rootNode = newNode;
        }
    }
    return rootNode
}
function patchIndices(patches) {
    var indices = [];
    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key));
        }
    }
    return indices
}

var patch_1$1 = patch_1;

var vnode = VirtualNode;
var noProperties = {};
var noChildren = [];
function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName;
    this.properties = properties || noProperties;
    this.children = children || noChildren;
    this.key = key != null ? String(key) : undefined;
    this.namespace = (typeof namespace === "string") ? namespace : null;
    var count = (children && children.length) || 0;
    var descendants = 0;
    var hasWidgets = false;
    var hasThunks = false;
    var descendantHooks = false;
    var hooks;
    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName];
            if (isVhook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {};
                }
                hooks[propName] = property;
            }
        }
    }
    for (var i = 0; i < count; i++) {
        var child = children[i];
        if (isVnode(child)) {
            descendants += child.count || 0;
            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true;
            }
            if (!hasThunks && child.hasThunks) {
                hasThunks = true;
            }
            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true;
            }
        } else if (!hasWidgets && isWidget_1(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true;
            }
        } else if (!hasThunks && isThunk_1(child)) {
            hasThunks = true;
        }
    }
    this.count = count + descendants;
    this.hasWidgets = hasWidgets;
    this.hasThunks = hasThunks;
    this.hooks = hooks;
    this.descendantHooks = descendantHooks;
}
VirtualNode.prototype.version = version;
VirtualNode.prototype.type = "VirtualNode";

var vtext = VirtualText;
function VirtualText(text) {
    this.text = String(text);
}
VirtualText.prototype.version = version;
VirtualText.prototype.type = "VirtualText";

var browserSplit = (function split(undef) {
  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    self;
  self = function(str, separator, limit) {
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") +
      (separator.sticky ? "y" : ""),
      lastLastIndex = 0,
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += "";
    if (!compliantExecNpcg) {
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    limit = limit === undef ? -1 >>> 0 :
    limit >>> 0;
    while (match = separator.exec(str)) {
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++;
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };
  return self;
})();

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;
var parseTag_1 = parseTag;
function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }
    var noId = !(props.hasOwnProperty('id'));
    var tagParts = browserSplit(tag, classIdSplit);
    var tagName = null;
    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }
    var classes, part, type, i;
    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];
        if (!part) {
            continue;
        }
        type = part.charAt(0);
        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }
    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }
        props.className = classes.join(' ');
    }
    return props.namespace ? tagName : tagName.toUpperCase();
}

var softSetHook = SoftSetHook;
function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }
    this.value = value;
}
SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

var root = typeof window !== 'undefined' ?
    window : typeof commonjsGlobal !== 'undefined' ?
    commonjsGlobal : {};
var individual = Individual;
function Individual(key, value) {
    if (key in root) {
        return root[key];
    }
    root[key] = value;
    return value;
}

var oneVersion = OneVersion;
function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';
    var versionValue = individual(enforceKey, version);
    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }
    return individual(key, defaultValue);
}

var MY_VERSION = '7';
oneVersion('ev-store', MY_VERSION);
var hashKey = '__EV_STORE_KEY@' + MY_VERSION;
var evStore = EvStore;
function EvStore(elem) {
    var hash = elem[hashKey];
    if (!hash) {
        hash = elem[hashKey] = {};
    }
    return hash;
}

var evHook = EvHook;
function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }
    this.value = value;
}
EvHook.prototype.hook = function (node, propertyName) {
    var es = evStore(node);
    var propName = propertyName.substr(3);
    es[propName] = this.value;
};
EvHook.prototype.unhook = function(node, propertyName) {
    var es = evStore(node);
    var propName = propertyName.substr(3);
    es[propName] = undefined;
};

var virtualHyperscript = h;
function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;
    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }
    props = props || properties || {};
    tag = parseTag_1(tagName, props);
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isVhook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }
    transformProperties(props);
    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }
    return new vnode(tag, props, childNodes, key, namespace);
}
function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new vtext(c));
    } else if (typeof c === 'number') {
        childNodes.push(new vtext(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (xIsArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}
function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];
            if (isVhook(value)) {
                continue;
            }
            if (propName.substr(0, 3) === 'ev-') {
                props[propName] = evHook(value);
            }
        }
    }
}
function isChild(x) {
    return isVnode(x) || isVtext(x) || isWidget_1(x) || isThunk_1(x);
}
function isChildren(x) {
    return typeof x === 'string' || xIsArray(x) || isChild(x);
}
function UnexpectedVirtualElement(data) {
    var err = new Error();
    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode);
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;
    return err;
}
function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

var h_1 = virtualHyperscript;

var createElement_1$1 = createElement_1;

var virtualDom = {
    diff: diff_1$1,
    patch: patch_1$1,
    h: h_1,
    create: createElement_1$1,
    VNode: vnode,
    VText: vtext
};
var virtualDom_1 = virtualDom.diff;
var virtualDom_2 = virtualDom.patch;
var virtualDom_3 = virtualDom.h;

function createElement$1(comp, vnode, opts) {
  var doc = opts ? opts.document || document_1 : document_1;
  vnode = handleThunk_1(vnode).a;
  if (isWidget_1(vnode)) {
    var _node = vnode.init();
    elementCreated(comp, _node, vnode.customDirection);
    return _node;
  } else if (isVtext(vnode)) {
    return doc.createTextNode(vnode.text);
  } else if (!isVnode(vnode)) {
    warn('Item is not a valid virtual dom node');
    return null;
  }
  var node = vnode.namespace === null ? doc.createElement(vnode.tagName) : doc.createElementNS(vnode.namespace, vnode.tagName);
  var props = vnode.properties;
  applyProperties_1(node, props);
  var children = vnode.children;
  for (var i = 0; i < children.length; i++) {
    var childNode = createElement$1(comp, children[i], opts);
    if (childNode) {
      node.appendChild(childNode);
    }
  }
  if (vnode.renderCompleted) {
    vnode.renderCompleted(node);
  }
  elementCreated(comp, node, vnode.customDirection);
  return node;
}
function _h(tagName, attrs, customDirection, children) {
  var vnode = virtualDom_3(tagName, attrs, children);
  setOnlyReadAttr(vnode, 'customDirection', customDirection || null);
  return vnode;
}

function createCompInstance(comConstructor, parentConf, parentComp) {
  var isClass$$1 = isClass(comConstructor);
  var comp = void 0;
  if (isClass$$1) {
    comp = new comConstructor(parentConf.attrs);
  } else {
    var props = getProps(parentConf.attrs);
    var template = comConstructor(props);
    comp = {
      constructor: comConstructor,
      name: comConstructor.name,
      noStateComp: !isClass$$1,
      template: template,
      props: props
    };
  }
  if (isClass$$1 && comp.prototype === Object.getPrototypeOf(parentComp)) {
    warn('Component can not refer to themselves  \n\n  --->  ' + parentComp.name + '\n');
    return;
  }
  if (!comConstructor.$ast) {
    comConstructor.$ast = createAst(comp);
  }
  return comp;
}
function createAst(comp) {
  var ast = void 0;
  var template = comp.template,
      name = comp.name;

  if (typeof template === 'function') {
    template = template.call(comp);
  }
  if (!isString(template)) {
    warn('Component template must a "string" or "function", But now is "' + (typeof template === 'undefined' ? 'undefined' : _typeof(template)) + '"\n      \n\n  --->  ' + name + '\n');
    return;
  }
  if (!(ast = parseTemplate(template.trim(), name))) {
    warn('No string template available  \n\n  --->  ' + name);
    return;
  }
  return ast;
}

var TEXT$1 = 0;
var SHOW = 1;
var ON = 2;
var BIND = 3;
var IF = 4;
var FOR = 5;
var directWeight = {
  'v-show': SHOW,
  'v-for': FOR,
  'v-on': ON,
  'v-text': TEXT$1,
  'v-bind': BIND,
  'v-if': IF
};
var DIRECTLENGTH = Object.keys(directWeight).length;
function getWeight(direct) {
  var wight = directWeight[direct];
  if (direct.includes('v-bind')) wight = BIND;
  if (direct.includes('v-on')) wight = ON;
  return wight;
}
function isReservedDirect(direct) {
  return direct.includes('v-') && getWeight(direct) !== undefined;
}

function vevent(events, comp, vnodeConf$$1) {
  if (isReservedTag(vnodeConf$$1.tagName)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var event = _step.value;

        var name = event.attrName;
        var code = '\n        with ($obj_) {\n          return ' + event.value + ';\n        }\n      ';
        vnodeConf$$1.attrs['on' + name] = runExecuteContext(code, 'on', vnodeConf$$1.tagName, comp);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
}

function vfor(node, comp, vnodeConf$$1) {
  if (!node.for || !node.forArgs) return;
  if (!node.parent) {
    sendDirectWarn('v-for', comp.name);
    return;
  }
  var cloneNodes = [];
  var _node$forArgs = node.forArgs,
      data = _node$forArgs.data,
      key = _node$forArgs.key,
      isMultiple = _node$forArgs.isMultiple;

  var code = '\n    with($obj_) {\n      for (var $index_ = 0; $index_ < ' + data + '.length; $index_++) {\n        if (' + isMultiple + ') {\n          $scope_.add(\'' + key[0] + '\', ' + data + '[$index_]);\n          $scope_.add(\'' + key[1] + '\', $index_);\n        } else {\n          $scope_.add(\'' + key + '\', ' + data + '[$index_]);\n        }\n\n        $callback_($index_);\n      }\n    }\n  ';
  function vforCallback(i) {
    var cloneNode = vnodeConf(node, vnodeConf$$1.parent);
    cloneNode.attrs['key'] = i;
    node.for = false;
    cloneNodes[i] = parseSingleNode(node, comp, cloneNode) === false ? null : cloneNode;
  }
  scope$1.create();
  runExecuteContext(code, 'for', vnodeConf$$1.tagName, comp, vforCallback);
  scope$1.destroy();
  var index = serachIndex(vnodeConf$$1);
  replaceWithLoopRes(vnodeConf$$1, cloneNodes, index);
  node.for = true;
}
function serachIndex(node) {
  var children = node.parent.children;
  var length = children.length;
  for (var i = 0; i < length; i++) {
    if (children[i] === node) return i;
  }
}
function replaceWithLoopRes(node, res, i) {
  var children = node.parent.children;
  children.splice.apply(children, [i, 1].concat(toConsumableArray(res)));
}

function vif(node, val, comp, vnodeConf$$1) {
  if (!node.parent) {
    return sendDirectWarn('v-if', comp.name);
  }
  var res = runExecuteContext('\n    with($obj_) {\n      return !!(' + val + ');\n    }\n  ', 'if', vnodeConf$$1.tagName, comp);
  if (!res) {
    removeChild(vnodeConf$$1.parent, vnodeConf$$1);
  }
  return res;
}

function show(val, comp, vnodeConf$$1) {
  var code = 'with($obj_) { return !!(' + val + '); }';
  var value = runExecuteContext(code, 'show', vnodeConf$$1.tagName, comp) ? '' : 'display: none';
  var bindValue = { attrName: 'style', value: value };
  if (isReservedTag(vnodeConf$$1.tagName)) {
    bind(bindValue, comp, vnodeConf$$1);
    return;
  }
  vnodeConf$$1.vShowResult = bindValue;
}

function text(val, comp, vnodeConf$$1) {
  var code = 'with($obj_) { return ' + val + '; }';
  var content = runExecuteContext(code, 'text', vnodeConf$$1.tagName, comp);
  if (isReservedTag(vnodeConf$$1.tagName)) {
    vnodeConf$$1.children = [vText(content, vnodeConf$$1)];
  } else {
    vnodeConf$$1.vTextResult = content;
  }
}

function runCustomDirect(key, tagName, val, comp) {
  return runExecuteContext('\n    with ($obj_) {\n      return ' + val + ';\n    }', key.slice(2, key.length), tagName, comp);
}

function complierAst(ast, comp) {
  if (!comp.noStateComp) {
    var state = comp.state;
    if (isFunction(state)) {
      var res = state();
      isPlainObject(res) ? comp.state = res : warn('Component "state" must be a "Object"  \n\n  ---> ' + comp.name + '\n');
    }
  }
  var vnodeConf$$1 = vnodeConf(ast);
  vnodeConf$$1.props = Object.create(null);
  parseSingleNode(ast, comp, vnodeConf$$1);
  scope$1.resetScope();
  return vnodeConf$$1;
}
function complierChildrenNode(node, comp, vnodeConf$$1) {
  var children = node.children;
  if (!children || !children.length) return;
  for (var i = 0; i < children.length; i++) {
    var childVnodeConf = vnodeConf(children[i], vnodeConf$$1);
    vnodeConf$$1.children.push(childVnodeConf);
    parseSingleNode(children[i], comp, childVnodeConf);
  }
}
function parseSingleNode(node, comp, vnodeConf$$1) {
  switch (node.type) {
    case TAG:
      if (parseTagNode(node, comp, vnodeConf$$1) === false) return false;
      break;
    case STATICTAG:
      parseStaticNode(node, comp, vnodeConf$$1);
      break;
  }
  if (!node.for) {
    complierChildrenNode(node, comp, vnodeConf$$1);
  }
}
function parseTagNode(node, comp, vnodeConf$$1) {
  if (node.hasBindings()) {
    return complierDirect(node, comp, vnodeConf$$1);
  }
}
function complierDirect(node, comp, vnodeConf$$1) {
  var directs = node.direction;
  var nomalDirects = [];
  var customDirects = {};
  var currentWeight = null;
  var currentCustomDirect = null;

  var _loop = function _loop(i) {
    var direct = directs[i];
    var key = Object.keys(direct)[0];
    if (!isReservedDirect(key)) {
      if (!haveRegisteredCustomDirect(key) || key === currentCustomDirect) {
        return 'continue';
      }
      currentCustomDirect = key;
      customDirects[key] = function delay() {
        customDirects[key] = runCustomDirect(key, vnodeConf$$1.tagName, direct[key], comp, vnodeConf$$1);
      };
      return 'continue';
    }
    var weight = getWeight(key);
    if (isSameDirect(weight)) return 'continue';
    currentWeight = weight;
    if (isMultipleDirect(weight)) {
      addMultipleDirect(direct, weight, key);
      return 'continue';
    }
    nomalDirects[weight] = direct[key];
  };

  for (var i = 0; i < directs.length; i++) {
    var _ret = _loop(i);

    if (_ret === 'continue') continue;
  }
  vnodeConf$$1.customDirection = customDirects;
  for (var w = DIRECTLENGTH - 1; w > -1; w--) {
    if (!nomalDirects[w]) continue;
    var directValue = nomalDirects[w];
    var execResult = executSingleDirect(w, directValue, node, comp, vnodeConf$$1);
    if (node.for) return;
    if (execResult === false) return false;
  }
  each(customDirects, function (val) {
    return val();
  });
  function addMultipleDirect(direct, weight, key) {
    var detail = {
      attrName: key.split(':')[1].trim(),
      value: direct[key]
    };
    !nomalDirects[weight] ? nomalDirects[weight] = [detail] : nomalDirects[weight].push(detail);
  }
  function isSameDirect(weight) {
    return weight !== BIND && weight !== ON && weight === currentWeight;
  }
  function isMultipleDirect(weight) {
    return weight === BIND || weight === ON;
  }
}
function parseStaticNode(node, comp, vnodeConf$$1) {
  var code = '\n    with ($obj_) {\n      function _s (_val_) { return _val_ };\n      return ' + node.expression + ';\n    }\n  ';
  vnodeConf$$1.content = runExecuteContext(code, '{{ }}', vnodeConf$$1.parent.tagName, comp);
}
function executSingleDirect(weight, val, node, comp, vnodeConf$$1) {
  switch (weight) {
    case SHOW:
      show(val, comp, vnodeConf$$1);
      break;
    case FOR:
      vfor(node, comp, vnodeConf$$1);
      break;
    case ON:
      vevent(val, comp, vnodeConf$$1);
      break;
    case TEXT$1:
      text(val, comp, vnodeConf$$1);
      break;
    case BIND:
      bind(val, comp, vnodeConf$$1);
      break;
    case IF:
      return vif(node, val, comp, vnodeConf$$1);
    default:
      customDirect(val, comp, vnodeConf$$1);
  }
}

function addCache(parentComp, compName, comp, i) {
  var childs = parentComp.$cacheState.childComponent[compName];
  if (!childs) {
    parentComp.$cacheState.childComponent[compName] = [];
  }
  parentComp.$cacheState.childComponent[compName][i] = comp;
}
function removeCache(parentComp, compName, comp) {
  var childs = parentComp.$cacheState.childComponent[compName];
  if (childs) {
    for (var i = 0, len = childs.length; i < len; i++) {
      var child = childs[i];
      if (child === comp) {
        childs[i] = null;
      }
    }
  }
}
function getCache(parentComp, compName, i) {
  var childs = parentComp.$cacheState.childComponent[compName];
  if (childs && childs[i]) {
    return childs[i];
  }
  return null;
}

function createVnode(parentConf, ast, comp) {
  var vnodeConf$$1 = complierAst(ast, comp);
  migrateCompStatus(parentConf, vnodeConf$$1);
  return _h(vnodeConf$$1.tagName, vnodeConf$$1.attrs, vnodeConf$$1.customDirection, generatorChildren(vnodeConf$$1.children, comp));
}
function generatorChildren(children, comp) {
  var vnodeTree = [];
  for (var i = 0; i < children.length; i++) {
    if (!children[i]) continue;
    var conf = children[i];
    if (conf.type === TAG) {
      if (!isReservedTag(conf.tagName)) {
        vnodeTree.push(createCustomComp(conf, comp, i));
        continue;
      }
      var _children = generatorChildren(conf.children, comp);
      vnodeTree.push(_h(conf.tagName, conf.attrs, conf.customDirection, _children));
      continue;
    }
    var content = toString(conf.content);
    if (content.trim()) {
      vnodeTree.push(content);
    }
  }
  return vnodeTree;
}
function createCustomComp(parentConf, comp, i) {
  var cacheInstance = getCache(comp, parentConf.tagName, i);
  if (cacheInstance) {
    cacheInstance.$parentConf = parentConf;
    return createCompVnode(parentConf, comp, cacheInstance);
  }
  var childComp = getChildComp(comp, parentConf.tagName);
  if (typeof childComp !== 'function') {
    warn('Component [' + parentConf.tagName + '] is not registered  \n\n  --->  ' + comp.name + '\n');
    return;
  }
  var childCompInstance = createCompInstance(childComp, parentConf, comp);
  addCache(comp, parentConf.tagName, childCompInstance, i);
  return createCompVnode(parentConf, comp, childCompInstance);
}
function getChildComp(parentComp, tagName) {
  if (!parentComp.component) return null;
  var childComps = parentComp.component;
  if (typeof childComps === 'function') {
    childComps = childComps();
  }
  if (isPlainObject(childComps)) {
    return childComps[tagName];
  }
  if (Array.isArray(childComps)) {
    for (var i = 0; i < childComps.length; i++) {
      if (tagName === childComps[i].name) {
        return childComps[i];
      }
    }
  }
  return null;
}

function createCompVnode(parentConf, parentComp, comp) {
  if (comp.$cacheState.componentElement) {
    return comp.$cacheState.componentElement;
  }
  var vnode = createNewCompVnode(parentConf, parentComp, comp);
  setOnlyReadAttr(vnode, 'customDirection', parentConf.customDirection || null);
  comp.$cacheState.componentElement = vnode;
  return vnode;
}
function createNewCompVnode(parentConf, parentComp, comp) {
  function ComponentElement() {}
  ComponentElement.prototype.type = 'Widget';
  ComponentElement.prototype.count = 0;
  ComponentElement.prototype.init = function () {
    return createRealDom(parentConf, comp);
  };
  ComponentElement.prototype.update = function (previous, domNode) {
    console.log('component update', previous, domNode);
  };
  ComponentElement.prototype.destroy = function (dom) {
    removeCache(parentComp, parentConf.tagName, comp);
    if (!comp.noStateComp) {
      comp.destroy(dom);
    }
  };
  return new ComponentElement();
}
function createRealDom(parentConf, comp) {
  var ast = comp.constructor.$ast;
  if (comp.noStateComp) {
    var _vTree = createVnode(parentConf, ast, comp);
    var _dom = createElement$1(comp, _vTree);
    return _dom;
  }
  comp.createBefore();
  var vTree = createVnode(parentConf, ast, comp);
  var dom = createElement$1(comp, vTree);
  comp.$cacheState.dom = dom;
  comp.$cacheState.vTree = vTree;
  comp.create(dom);
  return dom;
}

var capacity = 1024;
function enqueueSetState(comp, partialState) {
  if (!isPlainObject(partialState) && typeof partialState !== 'function') {
    return;
  }
  if (!comp.$cacheState.stateQueue.length) {
    updateQueue(comp);
  }
  comp.$cacheState.stateQueue.push(partialState);
}
function updateQueue(comp) {
  Promise.resolve().then(function () {
    var queue = comp.$cacheState.stateQueue;
    var state = Object.assign({}, comp.state);
    var index = 0;
    while (index < queue.length) {
      var currentIndex = index;
      index++;
      state = mergeState(state, queue[currentIndex]);
      if (index > capacity) {
        var newLength = queue.length - index;
        for (var i = 0; i < newLength; i++) {
          queue[i] = queue[index + i];
        }
        queue.length -= index;
        index = 0;
      }
    }
    queue.length = 0;
    comp.state = state;
    updateDomTree(comp);
  });
}
function mergeState(state, partialState) {
  if (typeof partialState === 'function') {
    var newState = partialState(state);
    return isPlainObject(newState) ? newState : state;
  }
  return Object.assign({}, state, partialState);
}
function updateDomTree(comp) {
  comp.willUpdate();
  var ast = comp.constructor.$ast;
  var dom = comp.$cacheState.dom;
  var oldTree = comp.$cacheState.vTree;
  var newTree = createVnode(comp.$parentConf, ast, comp);
  var patchs = virtualDom_1(oldTree, newTree);
  virtualDom_2(dom, patchs);
  updateChildComp(comp);
  comp.didUpdate(dom);
  comp.$cacheState.vTree = newTree;
  comp.$parentConf = null;
}
function updateChildComp(comp) {
  var cacheChild = comp.$cacheState.childComponent;
  var keys = Object.keys(cacheChild);
  for (var i = 0, len = keys.length; i < len; i++) {
    var childs = cacheChild[keys[i]];
    for (var j = 0, length = childs.length; j < length; j++) {
      var child = childs[j];
      if (child && !child.noStateComp && child.$parentConf) {
        var parentConf = child.$parentConf;
        var newProps = getProps(parentConf.attrs);
        var needUpdate = child.WillReceiveProps(newProps);
        if (needUpdate !== false) {
          child.props = newProps;
          child.setState({});
        }
      }
    }
  }
}

var Component = function () {
  function Component(attrs, requireList) {
    classCallCheck(this, Component);

    this.state = Object.create(null);
    this.props = getProps(attrs, requireList, this.name);
    this.$parentConf = null;
    this.$cacheState = {
      stateQueue: [],
      childComponent: {},
      componentElement: null,
      dom: null,
      vTree: null
    };
  }

  createClass(Component, [{
    key: 'createBefore',
    value: function createBefore() {}
  }, {
    key: 'create',
    value: function create() {}
  }, {
    key: 'willUpdate',
    value: function willUpdate() {}
  }, {
    key: 'didUpdate',
    value: function didUpdate() {}
  }, {
    key: 'WillReceiveProps',
    value: function WillReceiveProps() {}
  }, {
    key: 'destroy',
    value: function destroy() {}
  }, {
    key: 'setState',
    value: function setState(partialState) {
      enqueueSetState(this, partialState);
    }
  }, {
    key: 'createState',
    value: function createState(data) {
      if (isPlainObject(data)) {
        this.state = Object.setPrototypeOf(data, null);
      }
    }
  }, {
    key: 'name',
    get: function get$$1() {
      return this.constructor.name;
    }
  }]);
  return Component;
}();
function mount(rootDOM, compClass) {
  return new Promise(function (resolve) {
    var comp = createCompInstance(compClass, {}, {});
    var dom = createRealDom(null, comp);
    rootDOM.appendChild(dom);
    resolve(dom);
  });
}

var BaseObserver = function () {
  function BaseObserver() {
    classCallCheck(this, BaseObserver);

    this.commonFuns = [];
    this.onceFuns = [];
  }

  createClass(BaseObserver, [{
    key: 'on',
    value: function on(fun) {
      if (typeof fun === 'function') {
        var l = this.commonFuns.length;
        this.commonFuns[l] = fun;
      }
    }
  }, {
    key: 'once',
    value: function once(fun) {
      if (typeof fun === 'function') {
        var l = this.onceFuns.length;
        this.onceFuns[l] = fun;
      }
    }
  }, {
    key: 'emit',
    value: function emit(data) {
      var commonFuns = this.commonFuns,
          onceFuns = this.onceFuns;

      if (commonFuns.length) {
        for (var i = 0; i < commonFuns.length; i++) {
          commonFuns[i](data);
        }
      }
      if (onceFuns.length) {
        for (var j = 0; j < onceFuns.length; j++) {
          onceFuns[j](data);
          onceFuns.splice(j, 1);
          j--;
        }
      }
    }
  }, {
    key: 'remove',
    value: function remove(fun) {
      if (!fun || typeof fun !== 'function') {
        this.commonFuns = [];
        this.onceFuns = [];
      }
      removeFun(this.commonFuns, fun);
      removeFun(this.onceFuns, fun);
    }
  }]);
  return BaseObserver;
}();

function removeFun(arr, fun) {
  var index = void 0;
  var breakIndex = 0;
  while (~(index = arr.indexOf(fun, breakIndex))) {
    arr.splice(index, 1);
    breakIndex = index;
  }
}

function extendEvent(compClass) {
  if (!isClass(compClass)) {
    warn('Cannot create observers for stateless components\n\n  ---> ' + compClass.name + '\n');
    return;
  }
  if (!compClass || hasExpanded(compClass)) {
    return compClass;
  }
  var isDone = false;
  var nextOB = new BaseObserver();
  var doneOB = new BaseObserver();
  var errorOB = new BaseObserver();
  compClass.on = function on(callback) {
    if (typeof callback === 'function') {
      nextOB.on(callback);
    }
    return compClass;
  };
  compClass.once = function once(callback) {
    if (typeof callback === 'function') {
      nextOB.once(callback);
    }
    return compClass;
  };
  compClass.done = function done(callback) {
    if (typeof callback === 'function') {
      doneOB.on(callback);
    }
    return compClass;
  };
  compClass.error = function error(callback) {
    if (typeof callback === 'function') {
      errorOB.on(callback);
    }
    return compClass;
  };
  compClass.prototype.next = function _next(val) {
    if (!isDone) {
      nextOB.emit(val);
    }
    return this;
  };
  compClass.prototype.done = function _done(val) {
    if (!isDone) {
      doneOB.emit(val);
      isDone = true;
      remove$$1();
    }
  };
  compClass.prototype.error = function _error(reason) {
    if (!isDone) {
      errorOB.emit(creataError(reason));
      isDone = true;
      remove$$1();
    }
  };
  compClass.remove = compClass.prototype.remove = remove$$1;
  function remove$$1(fun) {
    nextOB.remove(fun);
    doneOB.remove(fun);
    errorOB.remove(fun);
  }
  return compClass;
}
function hasExpanded(compClass) {
  if (!compClass.$destroy) return false;
  return compClass.$destroy === compClass.prototype.$destroy;
}
function creataError(reason) {
  try {
    throw Error(reason);
  } catch (err) {
    return err;
  }
}

function initGlobalAPI (Grass) {
  Grass.directive = customDirective;
  Grass.event = extendEvent;
}

var Grass = {
  Component: Component,
  mount: mount
};
var prototype = {};
initGlobalAPI(prototype);
Object.setPrototypeOf(Grass, prototype);

export default Grass;
