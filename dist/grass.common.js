'use strict';

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
function isObject(obj) {
  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}
function isPlainObject(obj) {
  return typeOf(obj) === '[object Object]';
}
function isNumber(num) {
  return typeOf(num) === '[object Number]' && !isNaN(num);
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
  if (arr.length) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (cb(arr[i], i, i) === false) return;
    }
    return;
  }
  if (isPlainObject(arr)) {
    var keys = Object.keys(arr);
    for (var _i = 0, _len = keys.length; _i < _len; _i++) {
      if (cb(arr[keys[_i]], keys[_i], _i) === false) return;
    }
  }
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}
function toString(val) {
  return val == null ? '' : (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? JSON.stringify(val, null, 2) : String(val);
}
function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to;
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
function isDef(val) {
  return val !== undefined && val !== null;
}
function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}
var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);
function once(fun) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      return fun.apply(this, arguments);
    }
  };
}
function warn(msg, noError) {
  var errorInfor = '[Grass tip]: ' + msg;
  if (noError) {
    console.warn(errorInfor);
    return;
  }
  throw Error(errorInfor);
}
function grassWarn(msg, compName, noError) {
  var errorInfor = msg + '  \n\n    --->  ' + (compName || 'unknow') + '\n';
  warn(errorInfor, noError);
}

function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
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

var version = '2';

function isVNode(x) {
  return x && x.type === 'VirtualNode' && x.version === version;
}
function isVText(x) {
  return x && x.type === 'VirtualText' && x.version === version;
}
function isWidget(w) {
  return w && w.type === 'Widget';
}

var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot');
var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);
var isInternelTag = makeMap('slot');
function isReservedTag(tag) {
  return isHTMLTag(tag) || isSVG(tag);
}
function noop() {}
var isVNode$1 = function isVNode$$1(v) {
  return isVNode(v) || isVText(v) || isWidget(v);
};

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
VirtualNode.prototype.type = 'VirtualNode';

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
VirtualPatch.prototype.type = 'VirtualPatch';

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
      if (aKey === 'className' || aKey === 'styleName') {
        diff = diff || {};
        diff[aKey] = bValue;
      }
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
    key: key,
    from: index
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
  return { keys: keys, free: free };
}

function diff(a, b) {
  var patch = { a: a };
  var index = 0;
  walk(a, b, patch, index);
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
      apply = appendPatch(apply, new VirtualPatch(VirtualPatch.VNODE, a, b));
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
      patch[index] = appendPatch(patch[index], new VirtualPatch(VirtualPatch.REMOVE, vNode, null));
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

var raf = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout;
function nextFrame(fn) {
  raf(function () {
    raf(fn);
  });
}
var autoCssTransition = cached(function (name) {
  return {
    enterClass: name + '-enter',
    enterToClass: name + '-enter-to',
    enterActiveClass: name + '-enter-active',
    leaveClass: name + '-leave',
    leaveToClass: name + '-leave-to',
    leaveActiveClass: name + '-leave-active'
  };
});
var TRANSITION = 'transition';
var ANIMATION = 'animation';
var hasTransition = inBrowser && !isIE9;
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationEndEvent = 'animationend';
if (hasTransition) {
  if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
    animationEndEvent = 'webkitAnimationEnd';
  }
}
function enter(node, vnode, rm) {
  var _ref = vnode.data || {},
      vTransitionType = _ref.vTransitionType,
      vTransitionData = _ref.vTransitionData;

  if (!vTransitionType) {
    rm();
    return;
  }
  if (isDef(node._leaveCb)) {
    node._leaveCb();
  }
  if (node._enterCb) {
    rm();
    return;
  }
  var name = vTransitionData.name,
      hookFuns = vTransitionData.hookFuns;

  var type = vTransitionType === 'transition' ? TRANSITION : ANIMATION;
  if (callHook(hookFuns, node, 'beforeEnter') === false) {
    rm();
    return;
  }

  var _autoCssTransition = autoCssTransition(name),
      enterClass = _autoCssTransition.enterClass,
      enterActiveClass = _autoCssTransition.enterActiveClass,
      enterToClass = _autoCssTransition.enterToClass;

  var cb = node._enterCb = once(function () {
    removeTransitionClass(node, enterToClass);
    removeTransitionClass(node, enterActiveClass);
    callHook(hookFuns, node, 'afterEnter');
    node._enterCb = null;
    rm();
  });
  addTransitionClass(node, enterClass);
  addTransitionClass(node, enterActiveClass);
  nextFrame(function () {
    addTransitionClass(node, enterToClass);
    removeTransitionClass(node, enterClass);
    whenTransitionEnds(node, type, cb);
  });
}
function leave(node, vnode, rm) {
  var _ref2 = vnode.data || {},
      vTransitionType = _ref2.vTransitionType,
      vTransitionData = _ref2.vTransitionData;

  if (!vTransitionType) {
    rm();
    return;
  }
  if (isDef(node._enterCb)) {
    node._enterCb();
  }
  if (node._leaveCb) {
    rm();
    return;
  }
  var name = vTransitionData.name,
      hookFuns = vTransitionData.hookFuns;

  var type = vTransitionType === 'transtion' ? TRANSITION : ANIMATION;
  if (callHook(hookFuns, node, 'beforeLeave') === false) {
    rm();
    return;
  }

  var _autoCssTransition2 = autoCssTransition(name),
      leaveClass = _autoCssTransition2.leaveClass,
      leaveActiveClass = _autoCssTransition2.leaveActiveClass,
      leaveToClass = _autoCssTransition2.leaveToClass;

  if (node.parentNode) {
    if (!node.parentNode._pending) {
      node.parentNode._pending = [];
    }
    var index = node.parentNode._pending.length;
    node._index = index;
    node.parentNode._pending[index] = node;
  }
  var cb = node._leaveCb = once(function (noRemove) {
    if (!noRemove && node.parentNode && node.parentNode._pending) {
      node.parentNode._pending[node._index] = null;
    }
    removeTransitionClass(node, leaveToClass);
    removeTransitionClass(node, leaveActiveClass);
    callHook(hookFuns, node, 'afterLeave');
    node._leaveCb = null;
    rm();
  });
  addTransitionClass(node, leaveClass);
  addTransitionClass(node, leaveActiveClass);
  nextFrame(function () {
    addTransitionClass(node, leaveToClass);
    removeTransitionClass(node, leaveClass);
    whenTransitionEnds(node, type, cb);
  });
}
function addTransitionClass(node, cls) {
  var transitionClasses = node._transitionClasses || (node._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(node, cls);
  }
}
function removeTransitionClass(node, cls) {
  if (node._transitionClasses) {
    remove(node._transitionClasses, cls);
  }
  removeClass(node, cls);
}
function whenTransitionEnds(node, type, cb) {
  var ended = 0;

  var _getTransitionInfo = getTransitionInfo(node),
      propCount = _getTransitionInfo.propCount,
      timeout = _getTransitionInfo.timeout;

  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var end = function end() {
    node.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function onEnd(e) {
    if (++ended >= propCount) {
      end();
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  node.addEventListener(event, onEnd);
}
function getTransitionInfo(node) {
  var styles = window.getComputedStyle(node);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var propCount = transitionDurations.length;
  var timeout = transitionTimeout;
  return { propCount: propCount, timeout: timeout };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i]);
  }));
}
function toMs(s) {
  return Number(s.slice(0, -1)) * 1000;
}
function applyPendingNode(parentNode) {
  var pendingNode = parentNode && parentNode._pending;
  if (pendingNode && pendingNode.length) {
    for (var i = 0, len = pendingNode.length; i < len; i++) {
      var node = pendingNode[i];
      node && node._leaveCb && node._leaveCb(true);
    }
    parentNode._pending = [];
  }
}
function addClass(node, cls) {
  if (!cls || !(cls = cls.trim())) {
    return;
  }
  if (node.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) {
        return node.classList.add(c);
      });
    } else {
      node.classList.add(cls);
    }
  } else {
    var cur = ' ' + (node.getAttribute('class') || '') + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      node.setAttribute('class', (cur + cls).trim());
    }
  }
}
function removeClass(node, cls) {
  if (!cls || !(cls = cls.trim())) {
    return;
  }
  if (node.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) {
        return node.classList.remove(c);
      });
    } else {
      node.classList.remove(cls);
    }
    if (!node.classList.length) {
      node.removeAttribute('class');
    }
  } else {
    var cur = ' ' + (node.getAttribute('class') || '') + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      node.setAttribute('class', cur);
    } else {
      node.removeAttribute('class');
    }
  }
}
function callHook(funs, node, type) {
  var fun = funs['v-' + type];
  if (typeof fun === 'function') {
    return fun(node);
  }
}

function applyProperties(node, vnode, props, previous) {
  if (hasOwn(props, 'className')) {
    node.className = props.className;
  }

  var _loop = function _loop(propName) {
    var propValue = props[propName];
    if (propName === 'className') {
      return 'continue';
    }
    if (propValue === undefined) {
      removeProperty(node, propName, propValue, previous);
    } else if (isObject$2(propValue)) {
      patchObject(node, propName, propValue, previous);
    } else {
      if (propName === 'style' && vnode.data.haveShowTag) {
        transition(node, vnode, propValue, function () {
          node[propName] = propValue;
        });
      } else if (isAllow(propName)) {
        node[propName] = propValue;
      }
    }
  };

  for (var propName in props) {
    var _ret = _loop(propName);

    if (_ret === 'continue') continue;
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
      if (attrValue === undefined) {
        node.removeAttribute(attrName);
      } else {
        attrName === 'value' && node.getAttribute('value') != null ? node.value = attrValue : node.setAttribute(attrName, attrValue);
      }
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
function transition(node, vnode, propValue, callback) {
  var isShow = !propValue;
  if (isShow) {
    applyPendingNode(node.parentNode);
    callback();
    enter(node, vnode, noop);
  } else {
    leave(node, vnode, callback);
  }
}
function isObject$2(x) {
  return (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
}
function isAllow(x) {
  return x !== 'slot';
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

  vnode.el = node;
  applyProperties(node, vnode, properties);
  for (var i = 0, len = children.length; i < len; i++) {
    var childNode = createElement(children[i]);
    if (childNode) {
      node.appendChild(childNode);
    }
  }
  if (typeof vnode.elementCreated === 'function') {
    vnode.elementCreated(node, vnode);
  }
  if (!vnode.data.haveShowTag) {
    enter(node, vnode, noop);
  }
  return node;
}

var noChild = {};
function domIndex(rootNode, tree, indices) {
  if (!indices || !indices.length) {
    return {};
  }
  indices.sort(function (a, b) {
    return a > b ? 1 : -1;
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
      applyProperties(domNode, vNode, patch, vNode.properties);
      return domNode;
    default:
      return domNode;
  }
}
function removeNode(domNode, vNode) {
  var remove$$1 = once(function () {
    var parentNode = domNode.parentNode;
    if (parentNode) {
      parentNode.removeChild(domNode);
    }
    destroyWidget(domNode, vNode);
  });
  leave(domNode, vNode, remove$$1);
  return null;
}
function insertNode(parentNode, vNode, renderOptions) {
  applyPendingNode(parentNode);
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
  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode);
  }
  return newNode;
}
function widgetPatch(domNode, leftVNode, widget, renderOptions) {
  var updating = updateWidget(leftVNode, widget);
  var newNode = updating ? widget.update(leftVNode, domNode) || domNode : renderOptions.render(widget);
  var parentNode = domNode.parentNode;
  if (parentNode && newNode !== domNode) {
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
    var remove$$1 = removes[i];
    var node = childNodes[remove$$1.from];
    if (remove$$1.key) {
      keyMap[remove$$1.key] = node;
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

var uid = 0;

var Dep = function () {
  function Dep() {
    classCallCheck(this, Dep);

    this.id = uid++;
    this.subs = [];
    this.subsIds = new Set();
  }

  createClass(Dep, [{
    key: "addSub",
    value: function addSub(sub) {
      var obj = isObject(sub);
      if (obj && !this.subsIds.has(sub.id)) {
        this.subsIds.add(sub.id);
        this.subs.push(sub);
      } else if (!obj) {
        this.subs.push(sub);
      }
    }
  }, {
    key: "removeSub",
    value: function removeSub(sub) {
      if (isObject(sub)) {
        this.subsIds.delete(sub.id);
      }
      remove(this.subs, sub);
    }
  }, {
    key: "depend",
    value: function depend() {
      if (Dep.target) {
        Dep.target.addDep(this);
      }
    }
  }, {
    key: "notify",
    value: function notify(newValue, oldValue) {
      var subs = this.subs.slice();
      for (var i = 0, len = subs.length; i < len; i++) {
        subs[i].update(newValue, oldValue);
      }
    }
  }]);
  return Dep;
}();

Dep.target = null;
var targetStack = [];
function pushTarget(_target) {
  if (Dep.target) {
    targetStack.push(_target);
  }
  Dep.target = _target;
}
function clearTarget() {
  Dep.target = targetStack.pop();
}

var bailRE = /[^\w.$]/;
function parsePath(path) {
  if (bailRE.test(path)) {
    return;
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }
    return obj;
  };
}
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}
function protoAugment(target, src, keys) {
  target.__proto__ = src;
}
function copyAugment(target, src, keys) {
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);
var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

var _loop = function _loop(i, len) {
  var method = methodsToPatch[i];
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted = void 0;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) {
      ob.observeArray(inserted);
    }
    ob.dep.notify();
    return result;
  });
};

for (var i = 0, len = methodsToPatch.length; i < len; i++) {
  _loop(i, len);
}

var hasProto = '__proto__' in {};
var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
var Observer = function () {
  function Observer(value) {
    classCallCheck(this, Observer);

    this.value = value;
    this.dep = new Dep();
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      var augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  createClass(Observer, [{
    key: 'walk',
    value: function walk(obj) {
      var keys = Object.keys(obj);
      for (var i = 0, len = keys.length; i < len; i++) {
        defineReactive(obj, keys[i], obj[keys[i]]);
      }
    }
  }, {
    key: 'observeArray',
    value: function observeArray(items) {
      for (var i = 0, len = items.length; i < len; i++) {
        var item = items[i];
        observe(item);
      }
    }
  }]);
  return Observer;
}();
function defineReactive(obj, key, val) {
  var dep = new Dep();
  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }
  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function get$$1() {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function set$$1(newVal) {
      var value = getter ? getter.call(obj) : val;
      var oldValue = value;
      if (newVal === value || newVal !== newVal && value !== value) {
        return;
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify(newVal, oldValue);
    }
  });
}
function observe(value) {
  if (!isObject(value) || isVNode$1(value)) {
    return;
  }
  var ob = void 0;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if ((Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value)) {
    ob = new Observer(value);
  }
  return ob;
}
function dependArray(value) {
  for (var i = 0, len = value.length; i < len; i++) {
    var v = value[i];
    if (v && v.__ob__) {
      v.__ob__.dep.depend();
    }
    if (Array.isArray(v)) {
      dependArray(v);
    }
  }
}
function initWatchState(data) {
  observe(data);
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
      grassWarn('Parsing template error\n\n   Missing end tag', compName);
    }
  }
  return ast[0];
  function parseStart() {
    var match = html.match(startTagOpen);
    if (match && match[0]) {
      var indexKey = void 0,
          parent = void 0,
          container = void 0;
      var tagStr = match[0];
      var tagName = match[1];
      var isRoot = scope === ast;
      if (isRoot) {
        parent = null;
        indexKey = toString(ast.length);
        container = ast;
      } else {
        parent = scope;
        indexKey = toString(scope.children.length);
        container = scope.children;
      }
      var tagNode = createTag(tagName, indexKey, parent);
      container.push(tagNode);
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
          grassWarn('Component can only have one root node', compName);
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
    var args = /((\w+)|(\([^\(]+\)))\s+of\s+([\w\.\(\)\[\]\|\&\s]+)/g.exec(attr['v-for']);
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
      scope.for = true;
      scope.forArgs = args;
      scope.forMultipleArg = Array.isArray(args);
      scope.watcherCollectList = {};
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
  function createTag(tagName, indexKey, parent) {
    var root = parent ? false : true;
    return {
      type: TAG,
      tagName: tagName,
      bindState: [],
      children: [],
      attrs: {},
      start: index,
      indexKey: indexKey,
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
function elementCreated(dom, direaction, vnode) {
  if (!direaction || isEmptyObj(direaction)) return;
  var keys = Object.keys(direaction);

  var _loop = function _loop(i, len) {
    var key = keys[i];
    var val = directContainer[key];
    val.safePipe(function (callback) {
      callback(dom, direaction[key], vnode);
    });
  };

  for (var i = 0, len = keys.length; i < len; i++) {
    _loop(i, len);
  }
}

function createVNode(vnodeConfig, children) {
  var tagName = vnodeConfig.tagName,
      attrs = vnodeConfig.attrs,
      customDirection = vnodeConfig.customDirection;

  var vnode = h(tagName, attrs, children, function (dom, vnode) {
    elementCreated(dom, customDirection, vnode);
  });
  vnode.data = Object.create(null);
  if (vnodeConfig.vTransitionType) {
    var vTransitionType = vnodeConfig.vTransitionType,
        vTransitionData = vnodeConfig.vTransitionData;

    vnode.data.vTransitionType = vTransitionType;
    vnode.data.vTransitionData = vTransitionData;
  }
  if (!isUndef(vnodeConfig.isShow)) {
    vnode.data.haveShowTag = true;
  }
  if (attrs.slot) {
    vnode.slot = attrs.slot;
  }
  vnode.el = null;
  return vnode;
}

function getSlotVNode(name, component) {
  var slot = component.$slot;
  if (isUndef(name)) {
    return slot;
  }
  if (slot && Array.isArray(slot) && slot.length) {
    for (var i = 0, len = slot.length; i < len; i++) {
      var vnode = slot[i];
      if (isVNode$1(vnode)) {
        if (name === vnode.slot) {
          return vnode;
        }
      }
    }
  }
  return null;
}
function pushSlotVNode(vnodeChildren, vnode) {
  if (Array.isArray(vnode)) {
    vnodeChildren.push.apply(vnodeChildren, vnode);
  } else {
    vnodeChildren.push(vnode);
  }
}

function createAsyncComponent(factory, context, cb) {
  if (factory.error && factory.errorComp) {
    return factory.errorComp;
  }
  if (!factory.error && factory.resolved) {
    return factory.resolved;
  }
  if (!factory.error && factory.loading && factory.loadingComp) {
    return factory.loadingComp;
  }
  if (Array.isArray(factory.context)) {
    factory.context.push(context);
  } else {
    var contexts = factory.context = [context];
    var sync = true;
    var complete = false;
    var forceRender = function forceRender() {
      for (var i = 0, len = contexts.length; i < len; i++) {
        contexts[i].forceUpdate();
      }
    };
    var resolve = once(function (res) {
      if (complete) return;
      factory.resolved = ensureCtor(res);
      if (!sync) {
        if (typeof cb === 'function') {
          cb(null, factory.resolved);
        }
        forceRender();
        complete = true;
      }
    });
    var reject = once(function (reason) {
      if (complete) return;
      if (typeof cb === 'function') {
        cb(reason, null);
      } else {
        warn('Failed to resolve async component: ' + (reason ? reason : ''), true);
      }
      factory.error = true;
      complete = true;
      forceRender();
    });
    var res = factory(resolve, reject);
    dealWithResult(res, factory, resolve, reject, context, forceRender);
    sync = false;
    return factory.loading ? factory.loadingComp : factory.resolved;
  }
}
function dealWithResult(res, factory, resolve, reject, context, forceRender) {
  if (!isObject(res)) return;
  if (typeof res.then === 'function') {
    if (isUndef(factory.resolved)) {
      res.then(resolve, reject);
    }
  } else if (res.component && typeof res.component.then === 'function') {
    var error = res.error,
        delay = res.delay,
        loading = res.loading,
        timeout = res.timeout,
        component = res.component;

    component.then(resolve, reject);
    var setUtilComp = function setUtilComp(comp, name) {
      if (comp.async) {
        createAsyncComponent(comp.factory, context, function (err, cm) {
          if (!err) {
            factory[name] = cm;
          }
        });
      } else {
        factory[name] = comp;
      }
    };
    if (error) {
      setUtilComp(error, 'errorComp');
    }
    if (loading) {
      setUtilComp(loading, 'loadingComp');
      !isNumber(delay) && (delay = 0);
      if (delay === 0) {
        factory.loading = true;
      } else {
        setTimeout(function () {
          if (isUndef(factory.resolved) && isUndef(factory.error)) {
            factory.loading = true;
            forceRender();
          }
        }, delay);
      }
    }
    if (isNumber(timeout)) {
      setTimeout(function () {
        if (isUndef(factory.resolved)) {
          reject('timeout (' + res.timeout + 'ms)');
        }
      }, timeout);
    }
  }
}
function ensureCtor(component) {
  if (component.__esModule || hasSymbol && component[Symbol.toStringTag] === 'Module') {
    component = component.default;
  }
  return component;
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
function add(key, val, compName) {
  if (typeof key !== 'string') {
    grassWarn('The variable name of the "for" scope must be a "string"', compName);
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
function insertChain(obj, compName) {
  if (!isLegScope(obj)) {
    grassWarn('Insert "scope" must be a "object"', compName);
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

var Watcher = function () {
  function Watcher(id, compnent, expreOrFn, cb) {
    classCallCheck(this, Watcher);

    this.id = id;
    this.cb = cb;
    this.compnent = compnent;
    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    if (typeof expreOrFn === 'function') {
      this.getter = expreOrFn;
    } else {
      this.getter = parsePath(expreOrFn);
    }
    this.get();
  }

  createClass(Watcher, [{
    key: 'get',
    value: function get$$1() {
      pushTarget(this);
      var compnent = this.compnent;
      var data = compnent.state;
      this.getter.call(compnent, data);
      clearTarget();
      this.cleanupDeps();
    }
  }, {
    key: 'addDep',
    value: function addDep(dep) {
      var id = dep.id;
      if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id);
        this.newDeps.push(dep);
        if (!this.depIds.has(id)) {
          dep.addSub(this);
        }
      }
    }
  }, {
    key: 'cleanupDeps',
    value: function cleanupDeps() {
      var i = this.deps.length;
      while (i--) {
        var dep = this.deps[i];
        if (!this.newDepIds.has(dep.id)) {
          dep.removeSub(this);
        }
      }
      var tmp = this.depIds;
      this.depIds = this.newDepIds;
      this.newDepIds = tmp;
      this.newDepIds.clear();
      tmp = this.deps;
      this.deps = this.newDeps;
      this.newDeps = tmp;
      this.newDeps.length = 0;
    }
  }, {
    key: 'update',
    value: function update(newValue, oldValue) {
      this.cb.call(this.compnent, newValue, oldValue);
    }
  }]);
  return Watcher;
}();

function runExecuteContext(code, directName, vnodeConf, component, callback) {
  var noStateComp = component.noStateComp,
      state = component.state,
      props = component.props;

  var insertScope = noStateComp ? props : state;
  var realData = scope$1.insertChain(insertScope || {}, component.name);
  if (!/{{[\s\S]*}}/g.test(directName)) {
    directName = 'v-' + directName;
  }
  var options = {
    code: code,
    callback: callback,
    vnodeConf: vnodeConf,
    component: component,
    directName: directName,
    state: realData
  };
  return run(options);
}
function run(_ref) {
  var code = _ref.code,
      state = _ref.state,
      vnodeConf = _ref.vnodeConf,
      callback = _ref.callback,
      component = _ref.component,
      directName = _ref.directName;

  try {
    return getStateResult(code, vnodeConf, component, state, callback);
  } catch (error) {
    warn('Component directive compilation error  \n\n  "' + directName + '":  ' + error + '\n\n\n    --->  ' + (component.name || 'unknow') + ': <' + (vnodeConf.tagName || 'unknow') + '/>\n');
  }
}
function getStateResult(code, vnodeConf, component, state, callback) {
  var fun = new Function('$obj_', '$callback_', code);
  if (component.$isWatch && component.$firstCompilation) {
    var value = void 0;
    new Watcher(vnodeConf.indexKey, component, function () {
      value = fun.call(component, state, callback);
      return value;
    }, component.forceUpdate);
    return value;
  } else {
    return fun.call(component, state, callback);
  }
}

var objectFormat = /\{[^\}]*\}/;
var stringFormat = /.+\s*:\s*.+\s*;?/;
function bind(props, component, vnodeConf) {
  if (!Array.isArray(props)) {
    dealSingleBindAttr(props, component, vnodeConf);
    return;
  }
  for (var i = 0, len = props.length; i < len; i++) {
    dealSingleBindAttr(props[i], component, vnodeConf);
  }
}
function dealSingleBindAttr(_ref, component, vnodeConf) {
  var attrName = _ref.attrName,
      value = _ref.value;

  var originStyle = vnodeConf.attrs[attrName];
  if (attrName === 'style') {
    if (!value || stringFormat.test(value) && !objectFormat.test(value)) {
      vnodeConf.attrs.style = spliceStyleStr(originStyle, value);
      return;
    }
    vnodeConf.attrs.style = spliceStyleStr(originStyle, getFormatStyle(originStyle, getValue()));
    return;
  }
  vnodeConf.attrs[attrName] = component ? getValue() : value;
  function getValue() {
    return runExecuteContext('with($obj_) { return ' + value + '; }', 'bind', vnodeConf, component);
  }
}
function getNormalStyleKey(key) {
  return key.replace(/[A-Z]/g, function (k1) {
    return '-' + k1.toLocaleLowerCase();
  });
}
function getFormatStyle(o, v) {
  var keys = Object.keys(v);
  var result = '';
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = getNormalStyleKey(keys[i]);
    var value = v[keys[i]];
    if (test(o, result, key)) {
      result += key + ': ' + value + ';';
    }
  }
  return result;
}
function spliceStyleStr(o, n) {
  if (!o) return n;
  if (o[o.length - 1] === ';') return o + n;
  return o + ';' + n;
}
function test(o, str, key) {
  var reg = new RegExp(key, 'g');
  return !reg.test(o) && !reg.test(str);
}

function createVnodeConf(astNode, parent) {
  if (astNode.type === TAG) {
    var tagName = astNode.tagName,
        attrs = astNode.attrs,
        indexKey = astNode.indexKey,
        direction = astNode.direction;

    var _children = [];
    var _attrs = deepClone(attrs);
    var _direction = deepClone(direction);
    var tag = vTag(tagName, parent, _attrs, indexKey, _direction, _children);
    if (hasOwn(astNode, 'for')) {
      tag.for = true;
      tag.watcherCollectList = astNode.watcherCollectList;
    }
    return tag;
  }
  return vText(astNode.content, parent);
}
function vTag(tagName, parent, attrs, indexKey, direction, children) {
  var node = Object.create(null);
  node.type = TAG;
  node.attrs = attrs;
  node.parent = parent;
  node.tagName = tagName;
  node.indexKey = indexKey;
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
function removeChild(parent, child) {
  var children = parent.children;
  for (var i = 0; i < children.length; i++) {
    if (children[i] === child) {
      children[i] = null;
    }
  }
}

function migrateComponentStatus(outputNode, acceptNode) {
  if (!outputNode || !acceptNode) return;
  transitionDirect(outputNode, acceptNode);
  transitionClass(outputNode, acceptNode);
}
function shouldForceUpdate(node) {
  return !!(hasOwn(node, 'vTextResult') || hasOwn(node, 'vShowResult') || hasOwn(node, 'vTransitionType') || node.attrs && node.attrs.className);
}
function transitionDirect(O, A) {
  if (hasOwn(O, 'vTextResult')) {
    var res = O['vTextResult'];
    A.children.unshift(vText(toString(res), A));
  }
  if (hasOwn(O, 'vShowResult')) {
    var _res = O['vShowResult'];
    A.isShow = _res;
    bind(_res, null, A);
  }
  if (hasOwn(O, 'vTransitionType')) {
    A['vTransitionType'] = O['vTransitionType'];
    A['vTransitionData'] = O['vTransitionData'];
  }
}
function transitionClass(O, A) {
  if (hasOwn(O.attrs, 'className')) {
    var outputClassName = O.attrs['className'];
    var acceptClassName = A.attrs['className'];
    if (acceptClassName) {
      A.attrs['className'] = outputClassName + ' ' + acceptClassName;
    } else {
      A.attrs['className'] = outputClassName;
    }
  }
  if (hasOwn(O.attrs, 'styleName')) {
    var outputStyleName = O.attrs['styleName'];
    var acceptStyleName = A.attrs['styleName'];
    if (acceptStyleName) {
      A.attrs['styleName'] = outputStyleName + ' ' + acceptStyleName;
    } else {
      A.attrs['styleName'] = outputStyleName;
    }
  }
}

var TRANSITION$1 = 0;
var TEXT$1 = 1;
var SHOW = 2;
var ON = 3;
var BIND = 4;
var IF = 5;
var FOR = 6;
var directWeight = {
  'v-show': SHOW,
  'v-for': FOR,
  'v-on': ON,
  'v-text': TEXT$1,
  'v-bind': BIND,
  'v-if': IF,
  'v-transition': TRANSITION$1
};
var TRANSITIONHOOK = ['v-beforeEnter', 'v-afterEnter', 'v-beforeLeave', 'v-afterLeave'];
var DIRECTLENGTH = Object.keys(directWeight).length;
function getWeight(direation) {
  var wight = directWeight[direation];
  if (direation.includes('v-bind')) wight = BIND;
  if (direation.includes('v-on')) wight = ON;
  if (direation.includes('v-transition')) wight = TRANSITION$1;
  return wight;
}
function isReservedDireation(direation) {
  return direation.includes('v-') && getWeight(direation) !== undefined;
}
function isTransitionHook(direation) {
  return TRANSITIONHOOK.includes(direation);
}
function splitDireation(direationKey) {
  var args = direationKey.split('.');
  var direation = args[0];
  var modifiers = args.splice(1);
  return { direation: direation, modifiers: modifiers };
}

function vevent(events, component, vnodeConf) {
  if (isReservedTag(vnodeConf.tagName)) {
    for (var i = 0, len = events.length; i < len; i++) {
      var event = events[i];
      var direactiveKey = event.attrName;

      var _splitDireation = splitDireation(direactiveKey),
          name = _splitDireation.direation,
          modifiers = _splitDireation.modifiers;

      var code = '\n        with ($obj_) {\n          return ' + event.value + ';\n        }\n      ';
      var cb = runExecuteContext(code, 'on', vnodeConf, component);
      if (modifiers.length) {
        vnodeConf.attrs['on' + name] = createModifiersFun(modifiers, cb);
      } else {
        vnodeConf.attrs['on' + name] = cb;
      }
    }
  }
}
function createModifiersFun(modifiers, cb) {
  function eventCallback(e) {
    var haveSelf = void 0;
    var isSelf = e.target === e.currentTarget;
    for (var i = 0, len = modifiers.length; i < len; i++) {
      var val = modifiers[i];
      val === 'self' && (haveSelf = true);
      haveSelf ? isSelf && dealWithModifier(val) : dealWithModifier(val);
    }
    haveSelf ? isSelf && cb.call(this, e) : cb.call(this, e);
    function dealWithModifier(val) {
      switch (val) {
        case 'prevent':
          e.preventDefault();
          break;
        case 'stop':
          e.stopPropagation();
          break;
      }
    }
  }
  return eventCallback;
}

function vfor(node, component, vnodeConf) {
  if (!node.for || !node.forArgs) return;
  if (!node.parent) {
    sendDirectWarn('v-for', component.name);
    return;
  }
  var cloneNodes = [];
  var watcherCollectList = {};
  var _node$forArgs = node.forArgs,
      keys = _node$forArgs.key,
      data = _node$forArgs.data,
      isMultiple = _node$forArgs.isMultiple;

  var code = '\n    var $data;\n\n    with($obj_) { $data = ' + data + '; }\n\n    if ($data) {\n      $callback_($data);\n    }\n\n    return $data;\n  ';
  function loopData(data) {
    if (Array.isArray(data)) {
      for (var i = 0, len = data.length; i < len; i++) {
        var nodeKey = vnodeConf.indexKey + '_' + i;
        addValue(isMultiple, data[i], i, i, nodeKey);
      }
    } else if (isObject(data)) {
      var dataKey = Object.keys(data);

      var _loop = function _loop(_i, _len) {
        var key = dataKey[_i];
        var nodeKey = vnodeConf.indexKey + '_' + _i;
        var val = getValue(component, function () {
          return data[key];
        }, node, nodeKey);
        addValue(isMultiple, val, key, _i, nodeKey);
      };

      for (var _i = 0, _len = dataKey.length; _i < _len; _i++) {
        _loop(_i, _len);
      }
    } else {
      throw Error('Data must be a "array" or "object", but now is "' + (typeof data === 'undefined' ? 'undefined' : _typeof(data)) + ': ' + data + '"');
    }
  }
  function addValue(isMultiple, val, key, i, nodeKey) {
    if (isMultiple) {
      scope$1.add(keys[0], val, component.name);
      scope$1.add(keys[1], key, component.name);
    } else {
      scope$1.add(keys, val, component.name);
    }
    vforCallback(i, nodeKey);
  }
  function vforCallback(i, key) {
    var cloneNode = createVnodeConf(node, vnodeConf.parent);
    cloneNode.attrs['key'] = key;
    cloneNode.indexKey = key;
    node.for = false;
    cloneNodes[i] = parseSingleNode(node, component, cloneNode) === false ? null : cloneNode;
    if (component.$isWatch) {
      watcherCollectList[key] = true;
    }
  }
  scope$1.create();
  runExecuteContext(code, 'for', vnodeConf, component, loopData);
  scope$1.destroy();
  if (node.for === false) {
    node.watcherCollectList = watcherCollectList;
  }
  var index = serachIndex(vnodeConf);
  replaceWithLoopRes(vnodeConf, cloneNodes, index);
  node.for = true;
}
function serachIndex(node) {
  var index = node.parent.children.indexOf(node);
  return index > -1 ? index : undefined;
}
function replaceWithLoopRes(node, res, i) {
  var children = node.parent.children;
  children.splice.apply(children, [i, 1].concat(toConsumableArray(res)));
}
function getValue(component, fun, astNode, nodeKey) {
  if (!component.$isWatch) {
    return fun();
  } else {
    if (astNode.watcherCollectList[nodeKey]) {
      return fun();
    } else {
      var value = void 0;
      new Watcher(nodeKey, component, function () {
        return value = fun();
      }, component.forceUpdate);
      return value;
    }
  }
}

function vif(node, val, component, vnodeConf) {
  if (!node.parent) {
    return sendDirectWarn('v-if', component.name);
  }
  var res = runExecuteContext('\n    with($obj_) {\n      return !!(' + val + ');\n    }\n  ', 'if', vnodeConf, component);
  if (!res) {
    removeChild(vnodeConf.parent, vnodeConf);
    removeChildrenInstance(component, vnodeConf);
  }
  return res;
}
function removeChildrenInstance(component, vnodeConf) {
  var ref = vnodeConf.attrs.ref;
  if (isUndef(ref) || isHTMLTag(vnodeConf.tagName) || isInternelTag(vnodeConf.tagName)) return;
  var children = component.$children;
  if (children[ref]) {
    children[ref] = null;
  }
}

function show(val, component, vnodeConf) {
  var code = '\n    with($obj_) {\n      return !!(' + val + ');\n    }';
  var isShow = !!runExecuteContext(code, 'show', vnodeConf, component);
  var bindValue = {
    attrName: 'style',
    value: isShow ? '' : 'display: none'
  };
  vnodeConf.isShow = isShow;
  if (isReservedTag(vnodeConf.tagName)) {
    bind(bindValue, component, vnodeConf);
    return;
  }
  vnodeConf.vShowResult = bindValue;
}

function text(val, component, vnodeConf) {
  var code = 'with($obj_) { return ' + val + '; }';
  var content = runExecuteContext(code, 'text', vnodeConf, component);
  if (isReservedTag(vnodeConf.tagName)) {
    vnodeConf.children = [vText(content, vnodeConf)];
  } else {
    vnodeConf.vTextResult = content;
  }
}

function transition$1(direactiveKey, val, component, vnodeConf, transtionHookFuns) {
  var _splitDireation = splitDireation(direactiveKey),
      modifiers = _splitDireation.modifiers;

  var type = modifiers[0];
  var directName = type === 'animate' ? 'animation' : 'transition';
  var transitonName = runExecuteContext('return ' + val, directName, vnodeConf, component);
  var hookFuns = {};
  for (var key in transtionHookFuns) {
    var fun = runExecuteContext('return ' + transtionHookFuns[key], directName, vnodeConf, component);
    hookFuns[key] = fun;
  }
  vnodeConf.vTransitionType = directName;
  vnodeConf.vTransitionData = {
    name: transitonName,
    hookFuns: hookFuns
  };
}

function runCustomDirect(key, vnodeConf, val, component) {
  return runExecuteContext('\n    with ($obj_) {\n      return ' + val + ';\n    }', key.slice(2, key.length), vnodeConf, component);
}

function complierDirectFromAst(ast, component) {
  var vnodeConf = createVnodeConf(ast);
  vnodeConf.props = Object.create(null);
  parseSingleNode(ast, component, vnodeConf);
  scope$1.resetScope();
  return vnodeConf;
}
function complierChildrenNode(node, component, vnodeConf) {
  var children = node.children;
  if (!children || !children.length) return;
  for (var i = 0; i < children.length; i++) {
    var childVnodeConf = createVnodeConf(children[i], vnodeConf);
    vnodeConf.children.push(childVnodeConf);
    parseSingleNode(children[i], component, childVnodeConf);
  }
}
function parseSingleNode(node, component, vnodeConf) {
  switch (node.type) {
    case TAG:
      if (parseTagNode(node, component, vnodeConf) === false) {
        return false;
      }
      break;
    case STATICTAG:
      parseStaticNode(node, component, vnodeConf);
      break;
  }
  if (!node.for) {
    if (vnodeConf.type === TAG && isReservedTag(vnodeConf.tagName)) {
      modifyOrdinayAttrAsLibAttr(vnodeConf);
    }
    if (!isInternelTag(vnodeConf.tagName)) {
      complierChildrenNode(node, component, vnodeConf);
    }
  }
}
function parseTagNode(node, component, vnodeConf) {
  if (!isInternelTag(vnodeConf.tagName) && node.hasBindings()) {
    return complierDirect(node, component, vnodeConf);
  }
}
function complierDirect(node, component, vnodeConf) {
  var directs = node.direction;
  var nomalDirects = [];
  var customDirects = {};
  var transtionHookFuns = {};
  var currentWeight = null;
  var currentCustomDirect = null;

  var _loop = function _loop(i) {
    var direct = directs[i];
    var key = Object.keys(direct)[0];
    if (isTransitionHook(key)) {
      transtionHookFuns[key] = direct[key];
      return 'continue';
    }
    if (!isReservedDireation(key)) {
      if (haveRegisteredCustomDirect(key) && key !== currentCustomDirect) {
        currentCustomDirect = key;
        customDirects[key] = function delay() {
          customDirects[key] = runCustomDirect(key, vnodeConf, direct[key], component, vnodeConf);
        };
      }
      return 'continue';
    }
    var weight = getWeight(key);
    if (isSameDirect(weight)) return 'continue';
    currentWeight = weight;
    if (isMultipleDirect(weight)) {
      addMultipleDirect(direct, weight, key);
      return 'continue';
    }
    nomalDirects[weight] = {
      key: key,
      val: direct[key]
    };
  };

  for (var i = 0; i < directs.length; i++) {
    var _ret = _loop(i);

    if (_ret === 'continue') continue;
  }
  vnodeConf.customDirection = customDirects;
  for (var w = DIRECTLENGTH - 1; w > -1; w--) {
    if (!nomalDirects[w]) continue;
    var _nomalDirects$w = nomalDirects[w],
        val = _nomalDirects$w.val,
        _key = _nomalDirects$w.key;

    var execResult = executSingleDirect(w, _key, val, node, component, vnodeConf, transtionHookFuns);
    if (node.for) return;
    if (execResult === false) {
      return false;
    }
  }
  each(customDirects, function (val) {
    return val();
  });
  function addMultipleDirect(direct, weight, key) {
    var detail = {
      attrName: key.split(':')[1].trim(),
      value: direct[key]
    };
    if (!nomalDirects[weight]) {
      nomalDirects[weight] = {
        key: '',
        val: [detail]
      };
    } else {
      nomalDirects[weight].val.push(detail);
    }
  }
  function isSameDirect(weight) {
    return weight !== BIND && weight !== ON && weight === currentWeight;
  }
  function isMultipleDirect(weight) {
    return weight === BIND || weight === ON;
  }
}
function parseStaticNode(node, component, vnodeConf) {
  var code = '\n    with ($obj_) {\n      function _s (_val_) { return _val_ };\n      return ' + node.expression + ';\n    }\n  ';
  vnodeConf.content = runExecuteContext(code, '{{ ' + node.expression + ' }}', vnodeConf.parent, component);
}
function executSingleDirect(weight, key, val, node, component, vnodeConf, transtionHookFuns) {
  switch (weight) {
    case SHOW:
      show(val, component, vnodeConf);
      break;
    case FOR:
      vfor(node, component, vnodeConf);
      break;
    case ON:
      vevent(val, component, vnodeConf);
      break;
    case TEXT$1:
      text(val, component, vnodeConf);
      break;
    case BIND:
      bind(val, component, vnodeConf);
      break;
    case IF:
      return vif(node, val, component, vnodeConf);
    case TRANSITION$1:
      return transition$1(key, val, component, vnodeConf, transtionHookFuns);
    default:
      customDirect(val, component, vnodeConf);
  }
}
var filterAttr = {
  'namespace': 1,
  'className': 1,
  'styleName': 1,
  'style': 1,
  'class': 1,
  'slot': 1,
  'key': 1,
  'id': 1
};
var isFilter = function isFilter(key) {
  return filterAttr[key] || key.slice(0, 2) === 'on';
};
function modifyOrdinayAttrAsLibAttr(node) {
  if (!node.attrs) return;
  var keyWord = 'attributes';
  var attrs = node.attrs;
  var originAttr = attrs[keyWord];
  var keys = Object.keys(attrs);
  attrs[keyWord] = Object.create(null);
  for (var i = 0, len = keys.length; i < len; i++) {
    var _key2 = keys[i];
    if (isFilter(_key2)) continue;
    attrs[keyWord][_key2] = attrs[_key2];
    if (_key2 !== keyWord) {
      attrs[_key2] = undefined;
    }
  }
  if (originAttr) {
    attrs[keyWord][keyWord] = originAttr;
  }
}

function render(widgetVNode, ast) {
  var component = widgetVNode.component,
      data = widgetVNode.data;

  var vnodeConfig = complierDirectFromAst(ast, component);
  if (typeof component.constructor.CSSModules === 'function') {
    component.constructor.CSSModules(vnodeConfig, component.name);
  }
  if (!isEmptyObj(data.parentConfig)) {
    migrateComponentStatus(data.parentConfig, vnodeConfig);
  }
  if (component.$firstCompilation) {
    component.$firstCompilation = false;
  }
  return createVNode(vnodeConfig, genChildren(vnodeConfig.children, component));
}
function genChildren(children, component) {
  var vnodeChildren = [];
  for (var i = 0, len = children.length; i < len; i++) {
    var child = children[i];
    if (child) {
      if (child.type === TAG) {
        if (isReservedTag(child.tagName)) {
          var vnode = createVNode(child, genChildren(child.children, component));
          vnodeChildren.push(vnode);
        } else if (isInternelTag(child.tagName)) {
          if (child.tagName === 'slot') {
            var _vnode = getSlotVNode(child.attrs.name, component);
            if (_vnode) {
              pushSlotVNode(vnodeChildren, _vnode);
            }
          }
        } else {
          var childClass = getComponentClass(child, component);
          if (childClass.async) {
            var _childClass = childClass,
                factory = _childClass.factory,
                cb = _childClass.cb;

            childClass = createAsyncComponent(factory, component, cb);
            if (!childClass) {
              continue;
            }
          }
          var slotVNode = genChildren(child.children, component);
          var _vnode2 = new WidgetVNode(component, child, slotVNode, childClass);
          vnodeChildren.push(_vnode2);
        }
      } else {
        var content = toString(child.content);
        if (content.trim()) {
          vnodeChildren.push(content);
        }
      }
    }
  }
  return vnodeChildren;
}
function getComponentClass(vnodeConfig, parentCompnent) {
  var childComponents = parentCompnent.component;
  var tagName = vnodeConfig.tagName;

  var warn$$1 = function warn$$1() {
    grassWarn('Component [' + tagName + '] is not registered', parentCompnent.name);
  };
  if (!childComponents) {
    warn$$1();
    return null;
  }
  if (typeof childComponents === 'function') {
    parentCompnent.component = childComponents = childComponents.call(parentCompnent);
  }
  if (isPlainObject(childComponents)) {
    var res = childComponents[tagName];
    if (res) {
      return res;
    }
  }
  warn$$1();
}

var CAPACITY = 1024;
function enqueueSetState(component, partialState) {
  if (isLegalState(partialState)) {
    var data = component.$data;
    if (!data.stateQueue.length) {
      batchUpdateQueue(component);
    }
    data.stateQueue.push(partialState);
  }
}
function batchUpdateQueue(component) {
  Promise.resolve().then(function () {
    var queue = component.$data.stateQueue;
    var state = Object.assign({}, component.state);
    var index = 0;
    while (index < queue.length) {
      var currentIndex = index;
      index++;
      state = mergeState(state, queue[currentIndex]);
      if (index > CAPACITY) {
        var newLength = queue.length - index;
        for (var i = 0; i < newLength; i++) {
          queue[i] = queue[index + i];
        }
        queue.length -= index;
        index = 0;
      }
    }
    queue.length = 0;
    component.state = state;
    updateDomTree(component);
  });
}
function updateDomTree(component) {
  var vnode = component.$widgetVNode;
  var _vnode$container = vnode.container,
      dom = _vnode$container.dom,
      vtree = _vnode$container.vtree;

  if (!component.noStateComp) {
    component.willUpdate(dom);
  }
  var ast = component.constructor.$ast;
  var newTree = render(vnode, ast);
  var patchs = diff(vtree, newTree);
  patch(dom, patchs);
  cacheComponentDomAndVTree(vnode, newTree, dom);
  if (!component.noStateComp) {
    component.didUpdate(dom);
  }
}
function mergeState(state, partialState) {
  if (typeof partialState === 'function') {
    var newState = partialState(state);
    return isPlainObject(newState) ? newState : state;
  }
  return isEmptyObj(partialState) ? state : Object.assign({}, state, partialState);
}
function isLegalState(state) {
  return isPlainObject(state) || typeof state === 'function';
}

function getComponentInstance(widgetVNode, parentComponent) {
  var componentClass = widgetVNode.componentClass,
      data = widgetVNode.data;

  var isClass$$1 = isClass(componentClass);
  var tagName = widgetVNode.data.parentConfig.tagName;
  var instance = void 0;
  if (isClass$$1) {
    instance = new componentClass(data.parentConfig.attrs);
    if (typeof instance.state === 'function') {
      var res = instance.state();
      isPlainObject(res) ? instance.state = res : grassWarn('Component "state" must be a "Object"', instance.name);
    }
  } else {
    var registerComponent = function registerComponent(name, comp) {
      if (typeof name === 'function') {
        comp = name;
        name = comp.name;
        if (!name) {
          grassWarn('Component must have a name, you can pass the component name in the first parameter', componentClass.name);
        }
      }
      components[name] = comp;
      return registerComponent;
    };

    var components = Object.create(null);
    var props = getProps(data.parentConfig.attrs);
    instance = createNoStateComponent(props, null, components, componentClass);

    instance.template = componentClass.call(instance, props, registerComponent, parentComponent);
  }
  if (tagName) {
    setOnlyReadAttr(instance, 'name', tagName);
  }
  if (!instance.noStateComp) {
    instance.beforeCreate();
  }
  if (!componentClass.$ast) {
    componentClass.$ast = genAstCode(instance);
  }
  return instance;
}
function createNoStateComponent(props, template, component, componentClass) {
  var comp = {
    props: props,
    template: template,
    component: component,
    noStateComp: true,
    name: componentClass.name,
    constructor: componentClass,
    $el: null,
    $slot: null,
    $parent: null,
    $children: {},
    $firstCompilation: true,
    $data: {
      stateQueue: [],
      created: false
    },
    forceUpdate: function forceUpdate$$1() {
      _forceUpdate(this);
    },
    setState: function setState(partialState) {
      enqueueSetState(this, partialState);
    }
  };
  setOnlyReadAttr(comp, 'noStateComp', true);
  return comp;
}
function genAstCode(component) {
  var template = component.template,
      name = component.name;

  var ast = void 0;
  if (typeof template === 'function') {
    template = template.call(component);
  }
  if (typeof template !== 'string') {
    grassWarn('Component template must a "string" or "function", But now is "' + (typeof template === 'undefined' ? 'undefined' : _typeof(template)) + '"', name);
    return;
  }
  if (!(ast = parseTemplate(template.trim(), name))) {
    grassWarn('No string template available', name);
    return;
  }
  return ast;
}

var WidgetVNode = function () {
  function WidgetVNode(parentComponent, parentConfig, slotVNode, componentClass) {
    classCallCheck(this, WidgetVNode);
    var _parentConfig$attrs = parentConfig.attrs,
        attrs = _parentConfig$attrs === undefined ? {} : _parentConfig$attrs,
        haveShowTag = parentConfig.haveShowTag,
        vTransitionType = parentConfig.vTransitionType,
        vTransitionData = parentConfig.vTransitionData,
        customDirection = parentConfig.customDirection;

    this.count = 0;
    this.type = 'Widget';
    this.component = null;
    this.slot = attrs.slot;
    this.name = componentClass.name;
    this.componentClass = componentClass;
    this.parentComponent = parentComponent;
    this.id = '_' + this.name + (parentConfig.indexKey || '');
    this.data = {
      haveShowTag: haveShowTag,
      vTransitionType: vTransitionType,
      vTransitionData: vTransitionData,
      customDirection: customDirection,
      parentConfig: parentConfig,
      slotVNode: slotVNode
    };
    this.container = {
      vtree: null,
      dom: null
    };
  }

  createClass(WidgetVNode, [{
    key: 'init',
    value: function init() {
      var parentComponent = this.parentComponent;
      var component = getComponentInstance(this, parentComponent);
      component.$slot = this.data.slotVNode;
      component.$widgetVNode = this;
      this.component = component;

      var _renderingRealDom = renderingRealDom(this),
          dom = _renderingRealDom.dom,
          vtree = _renderingRealDom.vtree;

      component.$el = dom;
      if (parentComponent) {
        var ref = this.data.parentConfig.attrs.ref;
        component.$parent = parentComponent;
        if (typeof ref === 'string' || typeof ref === 'number') {
          if (parentComponent.$children[ref]) {
            grassWarn('The component instance "' + ref + '" already exists, please change the ref name', component.name);
          } else {
            parentComponent.$children[ref] = component;
          }
        }
      }
      cacheComponentDomAndVTree(this, vtree, dom);
      component.$data.created = true;
      if (!component.noStateComp) {
        component.created(dom);
      }
      return dom;
    }
  }, {
    key: 'update',
    value: function update(previousVnode, dom) {
      transferData(this, previousVnode);
      _update(this);
      return dom;
    }
  }, {
    key: 'destroy',
    value: function destroy(dom) {
      if (typeof this.component.destroy === 'function') {
        this.component.destroy(dom);
      }
      this.component.$isDestroyed = true;
    }
  }, {
    key: 'elementCreated',
    value: function elementCreated$$1(dom, node) {
      elementCreated(dom, this.data.customDirection);
    }
  }]);
  return WidgetVNode;
}();
function renderingRealDom(widgetVNode) {
  var componentClass = widgetVNode.componentClass;

  var ast = componentClass.$ast;
  var vtree = render(widgetVNode, ast);
  var dom = createElement(vtree);
  return { dom: dom, vtree: vtree };
}
function cacheComponentDomAndVTree(widgetVNode, vtree, dom) {
  widgetVNode.container.vtree = vtree;
  widgetVNode.container.dom = dom;
}
function _update(_ref) {
  var component = _ref.component,
      parentConfig = _ref.data.parentConfig;

  if (component && parentConfig) {
    var $propsRequireList = component.$propsRequireList,
        name = component.name;

    var newProps = getProps(parentConfig.attrs, $propsRequireList, name);
    if (!component.noStateComp && component.willReceiveProps(newProps, shouldForceUpdate(parentConfig)) === false) {
      return;
    } else if (component.noStateComp) {
      var empty = function empty() {
        return empty;
      };
      component.constructor.call(component, newProps, empty, component.$parent);
    }
    component.props = newProps;
    !component.noStateComp && component.didReceiveProps();
    updateDomTree(component);
  }
}
function transferData(nv, ov) {
  nv.component = ov.component;
  nv.componentClass = ov.componentClass;
  nv.container = ov.container;
  nv.component.$widgetVNode = nv;
  nv.component.$slot = nv.data.slotVNode;
}

function set$1(target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  var ob = target.__ob__;
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val;
}
function del(target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }
  var ob = target.__ob__;
  if (!hasOwn(target, key)) {
    return;
  }
  delete target[key];
  if (ob) {
    ob.dep.notify();
  }
}
function isValidArrayIndex(val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}
window.set = set$1;
window.del = del;

var Component = function () {
  function Component(attrs, requireList) {
    classCallCheck(this, Component);

    this.name = this.constructor.name;
    this.state = Object.create(null);
    this.props = getProps(attrs, requireList, this.name);
    this.$el = null;
    this.$slot = null;
    this.$parent = null;
    this.$children = {};
    this.$isWatch = false;
    this.$firstCompilation = true;
    this.$propsRequireList = requireList;
    this.$data = {
      stateQueue: [],
      created: false
    };
  }

  createClass(Component, [{
    key: 'beforeCreate',
    value: function beforeCreate() {}
  }, {
    key: 'created',
    value: function created(dom) {}
  }, {
    key: 'willUpdate',
    value: function willUpdate(dom) {}
  }, {
    key: 'willReceiveProps',
    value: function willReceiveProps(newProps) {}
  }, {
    key: 'didReceiveProps',
    value: function didReceiveProps() {}
  }, {
    key: 'didUpdate',
    value: function didUpdate(dom) {}
  }, {
    key: 'destroy',
    value: function destroy(dom) {}
  }, {
    key: 'setState',
    value: function setState(partialState) {
      if (this.$isWatch) {
        grassWarn("Current response data pattern, you can't use setState method", this.name);
        return;
      }
      enqueueSetState(this, partialState);
    }
  }, {
    key: 'forceUpdate',
    value: function forceUpdate() {
      _forceUpdate(this);
    }
  }, {
    key: 'getComponent',
    value: function getComponent(name) {
      var component = this.component;
      if (component) {
        if (typeof component === 'function') {
          this.component = component = component.call(this);
        }
        var res = component[name];
        if (res) {
          if (res.async === true) {
            var factory = res.factory;
            if (!factory.loading && !factory.error) {
              return factory.resolved || null;
            }
          } else {
            return res;
          }
        }
      }
      return null;
    }
  }, {
    key: 'createState',
    value: function createState(data) {
      data = Object.setPrototypeOf(data, null);
      if (isPlainObject(data)) {
        this.state = data;
        this.$isWatch = false;
      }
    }
  }, {
    key: 'createResponseState',
    value: function createResponseState(data) {
      data = Object.setPrototypeOf(data, null);
      if (isPlainObject(data)) {
        initWatchState(data);
        this.set = set$1;
        this.delete = del;
        this.state = data;
        this.$isWatch = true;
      }
    }
  }], [{
    key: '$mount',
    value: function $mount(rootDOM) {
      return mount(rootDOM, this);
    }
  }]);
  return Component;
}();
function mount(rootDOM, componentClass) {
  var vnode = new WidgetVNode(null, {}, null, componentClass);
  var dom = createElement(vnode);
  rootDOM && rootDOM.appendChild(dom);
  return vnode.component;
}
var filterPropsList = {
  'key': 1,
  'slot': 1,
  'styleName': 1,
  'className': 1
};
function getProps(attrs, requireList, name) {
  var props = Object.create(null);
  if (!attrs) {
    return props;
  }
  var keys = Object.keys(attrs);
  var index = null;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (filterPropsList[key]) {
      continue;
    }
    var val = attrs[key];
    if (!requireList) {
      props[key] = val;
    } else if (requireList && ~(index = requireList.indexOf(key))) {
      props[key] = val;
      requireList.splice(index, 1);
    }
  }
  if (requireList && requireList.length) {
    var _attrs = requireList.join('", "');
    warn('Parent component does not pass "' + _attrs + '" attributes  \n\n    --->  ' + name + '\n', true);
  }
  return props;
}
function _forceUpdate(component) {
  var stateQueue = component.$data.stateQueue;
  if (!stateQueue.length) {
    Promise.resolve().then(function () {
      stateQueue.length = 0;
      updateDomTree(component);
    });
  }
  stateQueue.push(null);
}

var installedPlugins = [];
function use(plugin) {
  if (!plugin || installedPlugins.indexOf(plugin) > -1) {
    return this;
  }

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  args.unshift(this);
  if (typeof plugin === 'function') {
    plugin.apply(null, args);
  } else if (typeof plugin.init === 'function') {
    plugin.init.apply(plugin, args);
  }
  installedPlugins.push(plugin);
  return this;
}

function mixin(component, mixin) {
  if (component) {
    if (!mixin) {
      mixin = component;
      component = null;
    }
    var originComponent = this ? this.Component : Component;
    if (isObject(mixin)) {
      var proto = component ? component.prototype : originComponent.prototype;
      extend(proto, mixin);
    }
  }
  return this;
}

var version$1 = 'v1.0.0';

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
    grassWarn('Cannot create observers for stateless components', compClass.name);
    return;
  }
  if (!compClass || hasExpanded(compClass)) {
    return compClass;
  }
  var isDone = false;
  var nextOB = new BaseObserver();
  var doneOB = new BaseObserver();
  var errorOB = new BaseObserver();
  function on(callback) {
    if (typeof callback === 'function') {
      nextOB.on(callback);
    }
    return compClass;
  }
  function once$$1(callback) {
    if (typeof callback === 'function') {
      nextOB.once(callback);
    }
    return compClass;
  }
  function done(callback) {
    if (typeof callback === 'function') {
      doneOB.on(callback);
    }
    return compClass;
  }
  function error(callback) {
    if (typeof callback === 'function') {
      errorOB.on(callback);
    }
    return compClass;
  }
  function listener(type, callback) {
    if (typeof callback === 'function') {
      var cb = function cb(val) {
        if (val && !isPrimitive(val)) {
          if (val.type === type) {
            callback(val.data);
          }
        }
      };
      nextOB.on(cb);
      callback._parentCb = cb;
    }
    return compClass;
  }
  function prototypeNext(val) {
    if (!isDone) {
      nextOB.emit(val);
    }
    return this;
  }
  function prototypeDone(val) {
    if (!isDone) {
      doneOB.emit(val);
      isDone = true;
      remove$$1();
    }
  }
  function prototypeError(reason) {
    if (!isDone) {
      if (errorOB.commonFuns.length || errorOB.onceFuns.length) {
        errorOB.emit(reason);
      } else {
        throw new Error(reason);
      }
      isDone = true;
      remove$$1();
    }
  }
  function prototypeNextHelp(type, data) {
    this.next({ type: type, data: data });
    return this;
  }
  function remove$$1(fun) {
    if (fun && typeof fun._parentCb === 'function') {
      fun = fun._parentCb;
    }
    nextOB.remove(fun);
    doneOB.remove(fun);
    errorOB.remove(fun);
  }
  compClass.on = on;
  compClass.once = once$$1;
  compClass.done = done;
  compClass.error = error;
  compClass.listener = listener;
  compClass.prototype.next = prototypeNext;
  compClass.prototype.done = prototypeDone;
  compClass.prototype.error = prototypeError;
  compClass.prototype.tNext = prototypeNextHelp;
  compClass.remove = compClass.prototype.remove = remove$$1;
  return compClass;
}
function hasExpanded(compClass) {
  if (!compClass.remove) return false;
  return compClass.remove === compClass.prototype.remove;
}

var compName = void 0;
function CSSModules(styles) {
  return function (component) {
    if (!component || isEmptyObj(styles)) {
      return component;
    }
    component.CSSModules = function (vnodeConf, _compName) {
      compName = _compName;
      if (vnodeConf && vnodeConf.attrs) {
        replaceStyleName(vnodeConf.attrs, styles, vnodeConf.tagName);
      }
      applyChildren(vnodeConf, styles);
    };
    return component;
  };
}
function applyChildren(config, styles) {
  if (!config) return;
  var children = config.children;
  if (children) {
    for (var i = 0, len = children.length; i < len; i++) {
      var child = children[i];
      if (child && child.attrs) {
        replaceStyleName(child.attrs, styles, child.tagName);
      }
      applyChildren(child, styles);
    }
  }
}
function replaceStyleName(attrs, styles, tagName) {
  var result = '';
  if (typeof attrs.styleName === 'string') {
    var styleNames = attrs.styleName.split(' ');
    for (var i = 0, len = styleNames.length; i < len; i++) {
      var name = styleNames[i];
      if (name && hasOwn(styles, name)) {
        var value = styles[name];
        result += !result ? value : ' ' + value;
      } else if (name) {
        grassWarn('"' + name + '" CSS module is undefined', compName + (': <' + tagName + '/>'));
      }
    }
  }
  attrs.styleName = undefined;
  mergeClassName(attrs, result);
}
function mergeClassName(attrs, classResult) {
  if (!attrs.className) {
    attrs.className = classResult;
  } else if (classResult) {
    attrs.className += ' ' + classResult;
  }
}

function async(factory, cb) {
  var options = Object.create(null);
  options.factory = factory;
  options.async = true;
  options.cb = cb;
  return options;
}

function initGlobalAPI(Grass) {
  Grass.use = use;
  Grass.mixin = mixin;
  Grass.event = extendEvent;
  Grass.async = async;
  Grass.CSSModules = CSSModules;
  Grass.directive = customDirective;
  setOnlyReadAttr(Grass, 'version', version$1);
}

var Grass = {
  mount: mount,
  Component: Component,
  forceUpdate: _forceUpdate
};
var prototype = {};
initGlobalAPI(prototype);
if (Object.setPrototypeOf) {
  Object.setPrototypeOf(Grass, prototype);
} else {
  Grass.__proto__ = prototype;
}

module.exports = Grass;
