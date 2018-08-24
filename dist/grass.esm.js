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
      if (cb(arr[i], i, i) === false) return;
    }
    return;
  }
  if (isPlainObject(arr)) {
    var keyName = Object.keys(arr);
    var _length = keyName.length;
    for (; i < _length; i++) {
      if (cb(arr[keyName[i]], keyName[i], i) === false) {
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
    var fun = new Function('$obj_', '$callback_', runCode);
    return fun.call(comp, state, callback);
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
      keys = _node$forArgs.key,
      data = _node$forArgs.data,
      isMultiple = _node$forArgs.isMultiple;

  var code = '\n    var $data;\n\n    with($obj_) { $data = ' + data + '; }\n\n    if ($data) {\n      $callback_($data);\n    }\n  ';
  function loopData(data) {
    each(data, function (val, key, i) {
      if (isMultiple) {
        scope$1.add(keys[0], val);
        scope$1.add(keys[1], key);
      } else {
        scope$1.add(keys, val);
      }
      vforCallback(i);
    });
  }
  function vforCallback(i) {
    var cloneNode = vnodeConf(node, vnodeConf$$1.parent);
    cloneNode.attrs['key'] = i + '_';
    node.for = false;
    cloneNodes[i] = parseSingleNode(node, comp, cloneNode) === false ? null : cloneNode;
  }
  scope$1.create();
  runExecuteContext(code, 'for', vnodeConf$$1.tagName, comp, loopData);
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
function elementCreated(dom, direaction) {
  if (!direaction || isEmptyObj(direaction)) return;
  var keys = Object.keys(direaction);

  var _loop = function _loop(i, len) {
    var key = keys[i];
    var val = directContainer[key];
    val.safePipe(function (callback) {
      callback(dom, direaction[key]);
    });
  };

  for (var i = 0, len = keys.length; i < len; i++) {
    _loop(i, len);
  }
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

var version = 'taotao';

function isVNode(x) {
  return x && x.type === "VirtualNode" && x.version === version;
}
function isVText(x) {
  return x && x.type === "VirtualText" && x.version === version;
}
function isWidget(w) {
  return w && w.type === "Widget";
}

var noProperties = {};
var noChildren = [];
function VirtualNode(tagName, properties, children, key, namespace) {
  this.tagName = tagName;
  this.properties = properties || noProperties;
  this.children = children || noChildren;
  this.key = !isUndef$1(key) ? String(key) : undefined;
  this.namespace = typeof namespace === 'string' ? namespace : null;
  var count = children && children.length || 0;
  var descendants = 0;
  var hasWidgets = false;
  for (var i = 0; i < count; i++) {
    var child = children[i];
    if (isVNode(child)) {
      descendants += child.count || 0;
      if (!hasWidgets && child.hasWidgets) {
        hasWidgets = true;
      }
    } else if (!hasWidgets && isWidget(child)) {
      if (typeof child.destroy === 'function') {
        hasWidgets = true;
      }
    }
  }
  this.count = count + descendants;
  this.hasWidgets = hasWidgets;
}
function isUndef$1(v) {
  return v === undefined || v === null;
}
VirtualNode.prototype.version = version;
VirtualNode.prototype.type = "VirtualNode";

function VirtualText(text) {
  this.text = String(text);
}
VirtualText.prototype.version = version;
VirtualText.prototype.type = 'VirtualText';

function h(tagName, properties, children, elementCreated) {
  var childNodes = [];
  var tag = void 0,
      props = void 0,
      key = void 0,
      namespace = void 0;
  if (!children && isChildren(properties)) {
    children = properties;
    props = {};
  }
  props = props || properties || {};
  tag = parseTag(tagName, props);
  if (props.hasOwnProperty('key')) {
    key = props.key;
    props.key = undefined;
  }
  if (props.hasOwnProperty('namespace')) {
    namespace = props.namespace;
    props.namespace = undefined;
  }
  if (tag === 'INPUT' && !namespace && props.hasOwnProperty('value') && props.value !== undefined) {
    if (props.value !== null && typeof props.value !== 'string') {
      throw new Error('virtual-dom: "INPUT" value must be a "string" or "null"');
    }
  }
  if (!isUndef$2(children)) {
    addChild(children, childNodes);
  }
  var vNode = new VirtualNode(tag, props, childNodes, key, namespace);
  if (typeof elementCreated === 'function') {
    vNode.elementCreated = elementCreated;
  }
  return vNode;
}
function addChild(c, childNodes) {
  if (typeof c === 'string') {
    childNodes.push(new VirtualText(c));
  } else if (typeof c === 'number') {
    childNodes.push(new VirtualText(String(c)));
  } else if (isChild(c)) {
    childNodes.push(c);
  } else if (Array.isArray(c)) {
    for (var i = 0, len = c.length; i < len; i++) {
      addChild(c[i], childNodes);
    }
  } else if (isUndef$2(c)) {
    return;
  } else {
    throw new Error('Unexpected value type for input passed to h()');
  }
}
function parseTag(tagName, props) {
  if (!tagName) {
    return 'DIV';
  }
  return props.namespace ? tagName : tagName.toUpperCase();
}
function isChild(x) {
  return isVNode(x) || isVText(x) || isWidget(x);
}
function isChildren(x) {
  return typeof x === 'string' || Array.isArray(x) || isChild(x);
}
function isUndef$2(v) {
  return v === undefined || v === null;
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
function VirtualPatch(type, vNode, patch) {
    this.type = Number(type);
    this.vNode = vNode;
    this.patch = patch;
}
VirtualPatch.prototype.version = version;
VirtualPatch.prototype.type = "VirtualPatch";

function diffProps(a, b) {
  var diff = void 0;
  for (var aKey in a) {
    if (!(aKey in b)) {
      diff = diff || {};
      diff[aKey] = undefined;
      continue;
    }
    var aValue = a[aKey];
    var bValue = b[aKey];
    if (aValue === bValue) {
      continue;
    } else if (isObject$1(aValue) && isObject$1(bValue)) {
      if (Object.getPrototypeOf(aValue) === Object.getPrototypeOf(bValue)) {
        var objectDiff = diffProps(aValue, bValue);
        if (objectDiff) {
          diff = diff || {};
          diff[aKey] = objectDiff;
        }
      } else {
        diff = diff || {};
        diff[aKey] = bValue;
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
  return diff;
}
function isObject$1(x) {
  return (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
}

function reorder(aChildren, bChildren) {
  var bChildIndex = keyIndex(bChildren);
  var bKeys = bChildIndex.keys;
  var bFree = bChildIndex.free;
  if (bFree.length === bChildren.length) {
    return {
      children: bChildren,
      moves: null
    };
  }
  var aChildIndex = keyIndex(aChildren);
  var aKeys = aChildIndex.keys;
  var aFree = aChildIndex.free;
  if (aFree.length === aChildren.length) {
    return {
      children: bChildren,
      moves: null
    };
  }
  var newChildren = [];
  var freeCount = bFree.length;
  var freeIndex = 0;
  var deletedItems = 0;
  for (var i = 0, len = aChildren.length; i < len; i++) {
    var aItem = aChildren[i];
    var itemIndex = void 0;
    if (aItem.key) {
      if (bKeys.hasOwnProperty(aItem.key)) {
        itemIndex = bKeys[aItem.key];
        newChildren.push(bChildren[itemIndex]);
      } else {
        deletedItems++;
        newChildren.push(null);
      }
    } else {
      if (freeIndex < freeCount) {
        itemIndex = bFree[freeIndex++];
        newChildren.push(bChildren[itemIndex]);
      } else {
        deletedItems++;
        newChildren.push(null);
      }
    }
  }
  var lastFreeIndex = freeIndex >= bFree.length ? bChildren.length : bFree[freeIndex];
  for (var j = 0, _len = bChildren.length; j < _len; j++) {
    var newItem = bChildren[j];
    if (newItem.key) {
      if (!aKeys.hasOwnProperty(newItem.key)) {
        newChildren.push(newItem);
      }
    } else {
      if (j >= lastFreeIndex) {
        newChildren.push(newItem);
      }
    }
  }
  var simulate = newChildren.slice();
  var removes = [];
  var inserts = [];
  var simulateIndex = 0;
  var simulateItem = void 0;
  for (var k = 0, _len2 = bChildren.length; k < _len2;) {
    var wantedItem = bChildren[k];
    simulateItem = simulate[simulateIndex];
    while (simulateItem === null && simulate.length) {
      removes.push(remove$1(simulate, simulateIndex, null));
      simulateItem = simulate[simulateIndex];
    }
    if (simulateItem && simulateItem.key === wantedItem.key) {
      k++;
      simulateIndex++;
    } else {
      if (wantedItem.key) {
        if (simulateItem && simulateItem.key) {
          var positionInBkeys = bKeys[simulateItem.key];
          if (positionInBkeys === k + 1) {
            inserts.push({ key: wantedItem.key, to: k });
          } else {
            removes.push(remove$1(simulate, simulateIndex, simulateItem.key));
            simulateItem = simulate[simulateIndex];
            if (simulateItem && simulateItem.key === wantedItem.key) {
              simulateIndex++;
            } else {
              inserts.push({ key: wantedItem.key, to: k });
            }
          }
        } else {
          inserts.push({ key: wantedItem.key, to: k });
        }
        k++;
      } else if (simulateItem && simulateItem.key) {
        removes.push(remove$1(simulate, simulateIndex, simulateItem.key));
      }
    }
  }
  while (simulateIndex < simulate.length) {
    simulateItem = simulate[simulateIndex];
    removes.push(remove$1(simulate, simulateIndex, simulateItem && simulateItem.key));
  }
  if (removes.length === deletedItems && !inserts.length) {
    return {
      children: newChildren,
      moves: null
    };
  }
  return {
    children: newChildren,
    moves: {
      removes: removes,
      inserts: inserts
    }
  };
}
function remove$1(arr, index, key) {
  arr.splice(index, 1);
  return {
    from: index,
    key: key
  };
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
  };
}

function diff(a, b) {
  var patch = { a: a };
  walk(a, b, patch, 0);
  return patch;
}
function walk(a, b, patch, index) {
  if (a === b) {
    return;
  }
  var apply = patch[index];
  var applyClear = false;
  if (isUndef$3(b)) {
    if (!isWidget(a)) {
      destroyWidgets(a, patch, index);
      apply = patch[index];
    }
    apply = appendPatch(apply, new VirtualPatch(VirtualPatch.REMOVE, a, b));
  } else if (isVNode(b)) {
    if (isVNode(a) && isSameVnode(a, b)) {
      var propsPatch = diffProps(a.properties, b.properties);
      if (propsPatch) {
        apply = appendPatch(apply, new VirtualPatch(VirtualPatch.PROPS, a, propsPatch));
      }
      apply = diffChildren(a, b, patch, apply, index);
    } else {
      applyClear = true;
      apply = appendPatch(apply, new VirtualPatch(VirtualPatch.vNode, a, b));
    }
  } else if (isVText(b)) {
    if (!isVText(a)) {
      apply = appendPatch(apply, new VirtualPatch(VirtualPatch.VTEXT, a, b));
      applyClear = true;
    } else if (a.text !== b.text) {
      apply = appendPatch(apply, new VirtualPatch(VirtualPatch.VTEXT, a, b));
    }
  } else if (isWidget(b)) {
    if (!isWidget(a)) {
      applyClear = true;
    }
    apply = appendPatch(apply, new VirtualPatch(VirtualPatch.WIDGET, a, b));
  }
  if (apply) {
    patch[index] = apply;
  }
  if (applyClear) {
    destroyWidgets(a, patch, index);
  }
}
function destroyWidgets(vNode, patch, index) {
  if (isWidget(vNode)) {
    if (typeof vNode.destroy === 'function') {
      patch[index] = new VirtualPatch(VirtualPatch.REMOVE, vNode, null);
    }
  } else if (isVNode(vNode) && vNode.hasWidgets) {
    var children = vNode.children;
    for (var i = 0, len = children.length; i < len; i++) {
      var child = children[i];
      index++;
      destroyWidgets(child, patch, index);
      if (isVNode(child) && child.count) {
        index += child.count;
      }
    }
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
    index++;
    if (leftNode) {
      walk(leftNode, rightNode, patch, index);
    } else {
      if (rightNode) {
        apply = appendPatch(apply, new VirtualPatch(VirtualPatch.INSERT, null, rightNode));
      }
    }
    if (isVNode(leftNode) && leftNode.count) {
      index += leftNode.count;
    }
  }
  if (orderedSet.moves) {
    apply = appendPatch(apply, new VirtualPatch(VirtualPatch.ORDER, a, orderedSet.moves));
  }
  return apply;
}
function appendPatch(apply, patch) {
  if (apply) {
    Array.isArray(apply) ? apply.push(patch) : apply = [apply, patch];
    return apply;
  }
  return patch;
}
function isSameVnode(a, b) {
  return a.tagName === b.tagName && a.namespace === b.namespace && a.key === b.key;
}
function isUndef$3(v) {
  return v === undefined || v === null;
}

function applyProperties(node, props, previous) {
  for (var propName in props) {
    var propValue = props[propName];
    if (propValue === undefined) {
      removeProperty(node, propName, propValue, previous);
    } else if (isObject$2(propValue)) {
      patchObject(node, propName, propValue, previous);
    } else {
      node[propName] = propValue;
    }
  }
}
function removeProperty(node, propName, previous) {
  if (!previous) {
    return;
  }
  var previousValue = previous[propName];
  if (propName === 'attributes') {
    for (var attrName in previousValue) {
      node.removeAttribute(attrName);
    }
  } else if (propName === 'style') {
    for (var styleName in previousValue) {
      node.style[styleName] = '';
    }
  } else if (typeof previousValue === 'string') {
    node[propName] = '';
  } else {
    node[propName] = null;
  }
}
function patchObject(node, propName, propValue, previous) {
  var previousValue = previous ? previous[propName] : undefined;
  if (propName === 'attributes') {
    for (var attrName in propValue) {
      var attrValue = propValue[attrName];
      attrValue === undefined ? node.removeAttribute(attrName) : node.setAttribute(attrName, attrValue);
    }
    return;
  }
  if (previousValue && isObject$2(previousValue)) {
    if (Object.getPrototypeOf(previousValue) !== Object.getPrototypeOf(propValue)) {
      node[propName] = propValue;
      return;
    }
  }
  if (!isObject$2(node[propName])) {
    node[propName] = {};
  }
  var replacer = propName === 'style' ? '' : undefined;
  for (var key in propValue) {
    var value = propValue[key];
    node[propName][key] = value === undefined ? replacer : value;
  }
}
function isObject$2(x) {
  return (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
}

function createElement(vnode) {
  if (isWidget(vnode)) {
    var _node = vnode.init();
    if (typeof vnode.elementCreated === 'function') {
      vnode.elementCreated(_node, vnode);
    }
    return _node;
  } else if (isVText(vnode)) {
    return document.createTextNode(vnode.text);
  } else if (!isVNode(vnode)) {
    console.error('virtual-dom: Item is not a valid virtual dom node');
    return null;
  }
  var node = vnode.namespace === null ? document.createElement(vnode.tagName) : document.createElementNS(vnode.namespace, vnode.tagName);
  var properties = vnode.properties,
      children = vnode.children;

  applyProperties(node, properties);
  for (var i = 0, len = children.length; i < len; i++) {
    var childNode = createElement(children[i]);
    if (childNode) {
      node.appendChild(childNode);
    }
  }
  if (typeof vnode.elementCreated === 'function') {
    vnode.elementCreated(node, vnode);
  }
  return node;
}

var noChild = {};
function domIndex(rootNode, tree, indices) {
  if (!indices || !indices.length) {
    return {};
  }
  indices.sort(function (a, b) {
    return a > b;
  });
  return recurse(rootNode, tree, indices, null, 0);
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
      for (var i = 0, len = vChildren.length; i < len; i++) {
        rootIndex++;
        var vChild = vChildren[i] || noChild;
        var nextIndex = rootIndex + (vChild.count || 0);
        if (indexInRange(indices, rootIndex, nextIndex)) {
          recurse(childNodes[i], vChild, indices, nodes, rootIndex);
        }
        rootIndex = nextIndex;
      }
    }
  }
  return nodes;
}
function indexInRange(indices, left, right) {
  if (!indices.length) {
    return false;
  }
  var minIndex = 0;
  var maxIndex = indices.length - 1;
  var currentIndex = void 0;
  var currentItem = void 0;
  while (minIndex <= maxIndex) {
    currentIndex = (maxIndex + minIndex) / 2 >> 0;
    currentItem = indices[currentIndex];
    if (minIndex === maxIndex) {
      return currentItem >= left && currentItem <= right;
    } else if (currentItem < left) {
      minIndex = currentIndex + 1;
    } else if (currentItem > right) {
      maxIndex = currentIndex - 1;
    } else {
      return true;
    }
  }
  return false;
}

function applyPatch(vpatch, domNode, renderOptions) {
  var type = vpatch.type,
      vNode = vpatch.vNode,
      patch = vpatch.patch;

  switch (type) {
    case VirtualPatch.REMOVE:
      return removeNode(domNode, vNode);
    case VirtualPatch.INSERT:
      return insertNode(domNode, patch, renderOptions);
    case VirtualPatch.VTEXT:
      return stringPatch(domNode, patch, renderOptions);
    case VirtualPatch.WIDGET:
      return widgetPatch(domNode, vNode, patch, renderOptions);
    case VirtualPatch.VNODE:
      return vNodePatch(domNode, patch, renderOptions);
    case VirtualPatch.ORDER:
      reorderChildren(domNode, patch);
      return domNode;
    case VirtualPatch.PROPS:
      applyProperties(domNode, patch, vNode.properties);
      return domNode;
    default:
      return domNode;
  }
}
function removeNode(domNode, vNode) {
  var parentNode = domNode.parentNode;
  if (parentNode) {
    parentNode.removeChild(domNode);
  }
  destroyWidget(domNode, vNode);
  return null;
}
function insertNode(parentNode, vNode, renderOptions) {
  var newNode = renderOptions.render(vNode);
  if (parentNode) {
    parentNode.appendChild(newNode);
  }
  return parentNode;
}
function stringPatch(domNode, vText, renderOptions) {
  if (domNode.nodeType === 3) {
    domNode.replaceData(0, domNode.length, vText.text);
    return domNode;
  }
  var parentNode = domNode.parentNode;
  var newNode = renderOptions.render(vText);
  parentNode.replaceChild(domNode, newNode);
  return newNode;
}
function widgetPatch(domNode, leftVNode, widget, renderOptions) {
  var updating = updateWidget(leftVNode, widget);
  var newNode = updating ? widget.update(leftVNode, domNode) || domNode : renderOptions.render(widget);
  var parentNode = domNode.parentNode;
  if (parentNode) {
    parentNode.replaceChild(newNode, domNode);
  }
  if (!updating) {
    destroyWidget(domNode, widget);
  }
  return newNode;
}
function vNodePatch(domNode, vNode, renderOptions) {
  var parentNode = domNode.parentNode;
  var newNode = renderOptions.render(vNode);
  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode);
  }
  return newNode;
}
function reorderChildren(domNode, moves) {
  var childNodes = domNode.childNodes;
  var removes = moves.removes,
      inserts = moves.inserts;

  var keyMap = {};
  for (var i = 0, len = removes.length; i < len; i++) {
    var remove = removes[i];
    var node = childNodes[remove.from];
    if (remove.key) {
      keyMap[remove.key] = node;
    }
    domNode.removeChild(node);
  }
  var length = childNodes.length;
  for (var j = 0, _len = inserts.length; j < _len; j++) {
    var insert = inserts[j];
    var _node = keyMap[insert.key];
    domNode.insertBefore(_node, insert.to >= length++ ? null : childNodes[insert.to]);
  }
}
function destroyWidget(domNode, w) {
  if (typeof w.destroy === 'function' && isWidget(w)) {
    w.destroy(domNode);
  }
}
function updateWidget(a, b) {
  if (isWidget(a) && isWidget(b)) {
    return 'name' in a && 'name' in b ? a.id === b.id : a.init === b.init;
  }
  return false;
}

function patch(rootNode, patches) {
  var renderOptions = {};
  renderOptions.patch = patchRecursive;
  renderOptions.render = createElement;
  return renderOptions.patch(rootNode, patches, renderOptions);
}
function patchRecursive(rootNode, patches, renderOptions) {
  var indices = patchIndices(patches);
  if (!indices.length) {
    return rootNode;
  }
  var index = domIndex(rootNode, patches.a, indices);
  renderOptions.document = rootNode.ownerDocument;
  for (var i = 0, len = indices.length; i < len; i++) {
    var nodeIndex = indices[i];
    rootNode = applyPatch$1(rootNode, index[nodeIndex], patches[nodeIndex], renderOptions);
  }
  return rootNode;
}
function applyPatch$1(rootNode, domNode, patchList, renderOptions) {
  if (!domNode) {
    return rootNode;
  }
  if (Array.isArray(patchList)) {
    for (var i = 0, len = patchList.length; i < len; i++) {
      applySinglePatch(patchList[i]);
    }
  } else {
    applySinglePatch(patchList);
  }
  return rootNode;
  function applySinglePatch(_patch) {
    var newNode = applyPatch(_patch, domNode, renderOptions);
    if (rootNode === domNode) {
      rootNode = newNode;
    }
  }
}
function patchIndices(patches) {
  var indices = [];
  for (var key in patches) {
    if (key !== 'a') {
      indices.push(Number(key));
    }
  }
  return indices;
}

var h$1 = h;
var diff$1 = diff;
var patch$1 = patch;
var create$1 = createElement;

function _h(tagName, attrs, customDirection, children) {
  var vnode = h$1(tagName, attrs, children, function (dom, vnode) {
    elementCreated(dom, vnode.customDirection);
  });
  setOnlyReadAttr(vnode, 'customDirection', customDirection || null);
  return vnode;
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

function render(parentConf, ast, comp) {
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
  var vnode = createWidgetVnode(parentConf, parentComp, comp);
  comp.$cacheState.componentElement = vnode;
  return vnode;
}
function createWidgetVnode(parentConf, parentComp, comp) {
  function WidgetElement() {}
  WidgetElement.prototype.type = 'Widget';
  WidgetElement.prototype.count = 0;
  WidgetElement.prototype.customDirection = parentConf.customDirection || null;
  WidgetElement.prototype.init = function () {
    return createRealDom(parentConf, comp);
  };
  WidgetElement.prototype.update = function (previous, domNode) {
    console.log('component update', previous, domNode);
  };
  WidgetElement.prototype.destroy = function (dom) {
    removeCache(parentComp, parentConf.tagName, comp);
    if (!comp.noStateComp) {
      comp.destroy(dom);
    }
  };
  WidgetElement.prototype.elementCreated = function (dom, node) {
    elementCreated(dom, parentConf.customDirection);
  };
  return new WidgetElement();
}
function createRealDom(parentConf, comp) {
  var ast = comp.constructor.$ast;
  if (comp.noStateComp) {
    var _vTree = render(parentConf, ast, comp);
    var _dom = create$1(_vTree);
    return _dom;
  }
  comp.createBefore();
  var vTree = render(parentConf, ast, comp);
  var dom = create$1(vTree);
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
    var index$$1 = 0;
    while (index$$1 < queue.length) {
      var currentIndex = index$$1;
      index$$1++;
      state = mergeState(state, queue[currentIndex]);
      if (index$$1 > capacity) {
        var newLength = queue.length - index$$1;
        for (var i = 0; i < newLength; i++) {
          queue[i] = queue[index$$1 + i];
        }
        queue.length -= index$$1;
        index$$1 = 0;
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
  var newTree = render(comp.$parentConf, ast, comp);
  var patchs = diff$1(oldTree, newTree);
  patch$1(dom, patchs);
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
        var needUpdate = child.willReceiveProps(newProps);
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
    key: 'willReceiveProps',
    value: function willReceiveProps() {}
  }, {
    key: 'didUpdate',
    value: function didUpdate() {}
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
