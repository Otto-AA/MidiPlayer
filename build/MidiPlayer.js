(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MidiPlayer"] = factory();
	else
		root["MidiPlayer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 45);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(30)('wks');
var uid = __webpack_require__(31);
var Symbol = __webpack_require__(0).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(2);
var ctx = __webpack_require__(8);
var hide = __webpack_require__(5);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(9);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(6);
var createDesc = __webpack_require__(18);
module.exports = __webpack_require__(7) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(4);
var IE8_DOM_DEFINE = __webpack_require__(50);
var toPrimitive = __webpack_require__(51);
var dP = Object.defineProperty;

exports.f = __webpack_require__(7) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(16)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(11);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(9);
var document = __webpack_require__(0).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(29);
var defined = __webpack_require__(15);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(14);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(30)('keys');
var uid = __webpack_require__(31);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(6).f;
var has = __webpack_require__(12);
var TAG = __webpack_require__(1)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(15);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(11);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(49)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(26)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(27);
var $export = __webpack_require__(3);
var redefine = __webpack_require__(52);
var hide = __webpack_require__(5);
var has = __webpack_require__(12);
var Iterators = __webpack_require__(10);
var $iterCreate = __webpack_require__(53);
var setToStringTag = __webpack_require__(22);
var getPrototypeOf = __webpack_require__(59);
var ITERATOR = __webpack_require__(1)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(56);
var enumBugKeys = __webpack_require__(32);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(13);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(0).document;
module.exports = document && document.documentElement;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(4);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(10);
var ITERATOR = __webpack_require__(1)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(37);
var ITERATOR = __webpack_require__(1)('iterator');
var Iterators = __webpack_require__(10);
module.exports = __webpack_require__(2).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(13);
var TAG = __webpack_require__(1)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(1)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(4);
var aFunction = __webpack_require__(11);
var SPECIES = __webpack_require__(1)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(8);
var invoke = __webpack_require__(76);
var html = __webpack_require__(33);
var cel = __webpack_require__(17);
var global = __webpack_require__(0);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(13)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(4);
var isObject = __webpack_require__(9);
var newPromiseCapability = __webpack_require__(24);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(82);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = __webpack_require__(46);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = __webpack_require__(62);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(65);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = __webpack_require__(43);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(44);

var _createClass3 = _interopRequireDefault(_createClass2);

var _MidiParser = __webpack_require__(85);

var _MidiParser2 = _interopRequireDefault(_MidiParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** typedef noteEvent
 * @typedef noteEvent
 * @property {int} channel
 * @property {int} note
 * @property {float|undefined} length
 * @property {float} timestamp
 * @property {int} track
 * @property {string} type
 * @property {int|undefined} velocity
 */

/**
 * @description MidiPlayer loads a midi file and provides callbacks for several events
 */
var MidiPlayer = function () {
  function MidiPlayer() {
    (0, _classCallCheck3.default)(this, MidiPlayer);

    this._events = [];
    this._playedEvents = [];
    this._currentTime = 0;
    this._speed = 1;
    this._duration = 0;
    this._callbacks = [];
    this._highestCallbackId = -1;
  }

  /**
   * @param {string}  midi            - b64 encoded midi file
   * @param {int}     [noteShift=0]   - changes the note value of each element by n. (e.g. for a piano this should be -21)
   * @returns {Promise<noteEvent[]>}  - resolving with an array containing the formatted event
   */


  (0, _createClass3.default)(MidiPlayer, [{
    key: 'loadFromDataUrl',
    value: function loadFromDataUrl(midi, noteShift) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var midiParser = new _MidiParser2.default();
        var parsedMidi = midiParser.parseDataUrl(midi);
        _this.loadParsedMidi(parsedMidi, noteShift);
        resolve(_this.getMidiEvents());
      });
    }
    /**
     * @param {Uint8Array}  midi        - uint8 array representing midi file
     * @param {int}     [noteShift=0]   - changes the note value of each element by n. (e.g. for a piano this should be -21)
     * @returns {Promise<noteEvent[]>}  - resolving with an array containing the formatted events
     */

  }, {
    key: 'loadFromUint8Array',
    value: function loadFromUint8Array(midi, noteShift) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var midiParser = new _MidiParser2.default();
        var parsedMidi = midiParser.parseUint8(midi);
        _this2.loadParsedMidi(parsedMidi, noteShift);
        resolve(_this2.getMidiEvents());
      });
    }
    /**
     * @param {string}  url             - a relative url to the .mid file (e.g. ./data/test.mid)
     * @param {int}     [noteShift=0]   - changes the note value of each element by n. (e.g. for a piano this should be -21)
     * @returns {Promise<noteEvent[]>}  - resolving with an array containing the formatted events
     * @example <caption>Example for loading piano midi data</caption>
     * player.loadFromRelativeUrl('./data/test.mid', -21)
     *  .then(function(midiData) { console.log(midiData); })
     *  .catch(function(error) { console.log(error); });
     */

  }, {
    key: 'loadFromRelativeUrl',
    value: function loadFromRelativeUrl(url, noteShift) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var buffer = [];
            for (var i = 0; i < xhr.responseText.length; i++) {
              buffer[i] = String.fromCharCode(xhr.responseText.charCodeAt(i) & 255);
            }
            var data = buffer.join('');
            var midiParser = new _MidiParser2.default();
            var parsed = midiParser.parseText(data);
            resolve(_this3.loadParsedMidi(parsed, noteShift));
          }
        };
        xhr.send();
      });
    }

    /**
     * @param {noteEvent[]}   events    - array containing all formatted events
     * @param {int}     [noteShift=0]   - changes the note value of each element by n. (e.g. for a piano this should be -21)
     * @returns {noteEvent[]}
     */

  }, {
    key: 'loadParsedMidi',
    value: function loadParsedMidi(events, noteShift) {
      this.reset();

      this._events = events;
      if (noteShift) {
        this._events = this._events.map(function (event) {
          event.note += noteShift;
          return event;
        });
      }
      this._updateDuration();

      return this.getMidiEvents();
    }

    /**
     * @description Add an event listener
     * @param {string}   eventName   - specifies the trigger event name. Possible events are: start, finish, noteOn, noteOff
     * @param {function} callback
     * @example <caption>Example showing how to listen to noteOn events</caption>
     * player.addCallback('noteOn', function(event) { console.log(event); });
     */

  }, {
    key: 'addCallback',
    value: function addCallback(eventName, callback) {
      var targetEvent = { type: eventName };
      return this.addCustomCallback(targetEvent, callback);
    }

    /**
    * @description Add an event listener to a specific event
    * @param {object}   targetEvent
    * @param {function} callback
    * @returns {any}  id for removal of the callback
    * @example <caption>Example showing how to listen to noteOn events with the note 40</caption>
    * player.addCustomCallback({
    *   type: 'noteOn',
    *   note: 40
    * }, function(event) { console.log(event); });
    */

  }, {
    key: 'addCustomCallback',
    value: function addCustomCallback(targetEvent, callback) {
      var id = this._highestCallbackId + 1;
      this._highestCallbackId = id;
      this._callbacks.push({
        targetEvent: targetEvent,
        callback: callback,
        id: id
      });
      return id;
    }

    /**
     * @description Remove a callback
     * @param {any} id
     * @returns {bool}  callback has been found and removed
     * @example <caption>Example showing how to store a callback id and delete the callback with it</caption>
     * const playCallback = player.addCallback('play', function() { console.log('play'); });
     * player.removeCallback(playCallback);
     */

  }, {
    key: 'removeCallback',
    value: function removeCallback(id) {
      var numCallbacks = this._callbacks.length;
      this._callbacks = this._callbacks.filter(function (callback) {
        return callback.id !== id;
      });
      return numCallbacks > this._callbacks.length;
    }

    /** 
     * @description Remove all callbacks attached to the player
     */

  }, {
    key: 'removeAllCallbacks',
    value: function removeAllCallbacks() {
      this._callbacks = [];
    }

    /**
     * @param {string|object}  event   - string -> type which will be triggered | object -> event which will be triggered
     * @example <caption>Example showing how to trigger play</caption>
     * player.triggerCallbacks('play');   // Same as player.triggerCallbacks({type: 'play'});
     * @example <caption>Example showing how to trigger a specific noteEvent</caption>
     * player.triggerCallbacks({type: 'noteOn', note: 40, timestamp: 500, length: 50});
     */

  }, {
    key: 'triggerCallbacks',
    value: function triggerCallbacks(event) {
      if (typeof event === 'string') {
        event = { type: event };
      }
      this._callbacks.forEach(function (customCallback) {
        if (objContainsObj(event, customCallback.targetEvent)) {
          customCallback.callback(event);
        }
      });
    }

    /**
     * @description start playing the parsed midi from the current time
     */

  }, {
    key: 'play',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var nextEvent;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this._startingTime = new Date().getTime() - this.getCurrentTime() / this.getCurrentSpeed();
                this._playing = true;

                this.triggerCallbacks('play');

              case 3:
                if (!(this._playing && this._events.length > 0)) {
                  _context.next = 14;
                  break;
                }

                nextEvent = this._events[0];
                _context.next = 7;
                return this._waitForEvent(nextEvent);

              case 7:
                if (this._playing) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt('break', 14);

              case 9:

                this._handleEvent(nextEvent);
                this._events.shift(); // Remove event after waiting, so the event does not "disappear" from the lists for this time. Useful for modifying/getting events while playing
                this._playedEvents.push(nextEvent);
                _context.next = 3;
                break;

              case 14:

                this.pause();
                if (!this._events.length) {
                  this.triggerCallbacks('finish');
                }

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function play() {
        return _ref.apply(this, arguments);
      }

      return play;
    }()

    /**
     * @description pauses the playing at the current time
     */

  }, {
    key: 'pause',
    value: function pause() {
      if (this.isPlaying()) {
        this._playing = false;
        this.triggerCallbacks('pause');
      }
    }

    /**
     * @description pauses the playing and sets the current time to zero
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.pause();
      this.setTime(0);
      this.triggerCallbacks('stop');
    }

    /**
     * @description stops the player and removes all events
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.stop();
      this.removeEvents({});
    }

    /**
     * @param {int} miliseconds
     */

  }, {
    key: 'setTime',
    value: function setTime(miliseconds) {
      // Move events from this.events to this.playedEvents or the other way round
      while (this._events.length && miliseconds > this._events[0].timestamp) {
        this._playedEvents.push(this._events.shift());
      }
      while (this._playedEvents.length && miliseconds <= this._playedEvents[this._playedEvents.length - 1].timestamp) {
        this._events.unshift(this._playedEvents.pop());
      }
      // Set the current time    
      this._startingTime += miliseconds - this._currentTime;
      this._currentTime = miliseconds;
    }

    /**
     * @returns {int}   - current time in miliseconds
     */

  }, {
    key: 'getCurrentTime',
    value: function getCurrentTime() {
      if (this._playing) {
        this._updateCurrentTime();
      }

      return this._currentTime;
    }

    /**
     * @param {int} speed   - relative speed (1 is normal, 2 is double, 0.5 is half)
     */

  }, {
    key: 'setSpeed',
    value: function setSpeed(speed) {
      if (isNaN(speed) || speed <= 0) {
        throw new Error('speed must be a positive number', speed);
      }
      this._speed = speed;
    }

    /**
     * @returns {int}   - current relative speed
     */

  }, {
    key: 'getCurrentSpeed',
    value: function getCurrentSpeed() {
      return this._speed;
    }

    /**
     * @returns {bool}
     */

  }, {
    key: 'isPlaying',
    value: function isPlaying() {
      return this._playing;
    }

    /**
     * @returns {float} - duration of the midi in miliseconds
     */

  }, {
    key: 'getDuration',
    value: function getDuration() {
      return this._duration;
    }

    /**
     * @returns {noteEvent[]} - (all loaded events)
     */

  }, {
    key: 'getMidiEvents',
    value: function getMidiEvents() {
      return [].concat((0, _toConsumableArray3.default)(this._playedEvents), (0, _toConsumableArray3.default)(this._events));
    }

    /**
     * @description get all events which are in the range [currentTime <= event.timestamp <= currentTime + miliseconds]
     * @param {int} miliseconds   - specifies the end of the time range
     * @returns {noteEvent[]}
     */

  }, {
    key: 'getNextEventsByTime',
    value: function getNextEventsByTime(miliseconds) {
      return this.getEventsByTimeRange(this._currentTime, this._currentTime + miliseconds);
    }

    /**
     * @description get all events which are in the range [currentTime - miliseconds <= event.timestamp <= currentTime]
     * @param {int} miliseconds   - specifies the start of the time range
     * @returns {noteEvent[]}         - containing all events which are in the range [currentTime - miliseconds <-> currentTime]
     */

  }, {
    key: 'getPreviousEventsByTime',
    value: function getPreviousEventsByTime(miliseconds) {
      return this.getEventsByTimeRange(this._currentTime - miliseconds, this._currentTime);
    }

    /** 
     * @description get all events which are in the range [startTime <= event.timestamp <= endTime]
     * @param {int} startTime   - start of the time range in miliseconds
     * @param {int} endTime     - end of the time range in miliseconds
     * @returns {noteEvent[]}   - containing all events which are in the time range
     */

  }, {
    key: 'getEventsByTimeRange',
    value: function getEventsByTimeRange(startTime, endTime) {
      // TODO: Use more efficient method. e.g. binary search for identifying the start and end events.
      // Return all elements which are in this time span
      return [].concat((0, _toConsumableArray3.default)(this._playedEvents), (0, _toConsumableArray3.default)(this._events)).filter(function (event) {
        return startTime <= event.timestamp && event.timestamp <= endTime;
      });
    }

    /**
     * @param {noteEvent} newEvent - must contain: timestamp, type [, optional properties]
     * @example
     * player.addEvent({timestamp: 5000, note: 40, type: 'noteOn', length: 75, customPropOne: 'abc', customPropTwo: 'de'});
     */

  }, {
    key: 'addEvent',
    value: function addEvent(newEvent) {
      // TODO: add possibilty to add lots of events in an efficient way (e.g. sorting events to add, and then add them in ascending order)
      // Check if required properties are given
      if (!newEvent.hasOwnProperty('timestamp') || !newEvent.hasOwnProperty('type')) {
        throw new Error('Couldn\'t add event because not all neccessary properties where specifed');
      }

      var eventArray = newEvent.timestamp > this.getCurrentTime() ? this._events : this._playedEvents;
      var location = locationOf(newEvent, eventArray, function (a, b) {
        return a.timestamp - b.timestamp;
      });
      if (newEvent.timestamp > this.getCurrentTime()) {
        this._events.splice(location, 0, newEvent);
      } else {
        this._playedEvents.splice(location, 0, newEvent);
      }
      this._updateDuration();
    }

    /**
     * @description removes all events which have the same keys and properties as the search
     * @param {object}  search - e.g. {note: 40, type: 'noteOff'} or {timestamp: 500}
     * @example <caption>Example showing how to delete all noteOff events with the note 40</caption>
     * player.removeEvents({note: 40, type: 'noteOff'});
     * @example <caption>Example showing how to delete all events</caption>
     * player.removeEvents({});
     */

  }, {
    key: 'removeEvents',
    value: function removeEvents(search) {
      this._playedEvents = this._playedEvents.filter(function (event) {
        return !objContainsObj(event, search);
      });
      this._events = this._events.filter(function (event) {
        return !objContainsObj(event, search);
      });
    }

    /**
     * @description Reverse midi data so that playing afterwards will play the song backwards, but currentTime will still start from zero (and not from the end). (Not the same as reversing the order)
     */

  }, {
    key: 'reverseMidiData',
    value: function reverseMidiData() {
      var duration = this.getDuration();
      var events = this.getMidiEvents();

      // Reverse events and change timestamp
      events.reverse();
      events.forEach(function (event) {
        return event.timestamp = duration - event.timestamp;
      });

      // noteOff events are now before noteOn events. To fix this mirror noteOff events around corresponding noteOn event
      events.forEach(function (event, index) {
        if (event.type === 'noteOff') {
          // Find corresponding noteOn event
          for (var i = index + 1; i < events.length; i++) {
            if (events[i].type === 'noteOn' && events[i].note === event.note) {
              // Mirror noteOff event around noteOn event  (e.g. noteOff - noteOn -> new noteOff: 10 - 15 -> 20)
              var timeDiff = events[i].timestamp - event.timestamp;
              event.timestamp += 2 * timeDiff;
              break;
            }
          }
        }
      });

      events.sort(function (a, b) {
        return a.timestamp - b.timestamp;
      });

      // Change timestamps so the first event starts with timestamp=0
      var timeOffset = events[0].timestamp;
      events.forEach(function (event) {
        return event.timestamp -= timeOffset;
      });

      this.loadParsedMidi(events);
    }

    /** 
     * @description Update currentTime based on _startingTime, _speed and the date time
     */

  }, {
    key: '_updateCurrentTime',
    value: function _updateCurrentTime() {
      this._currentTime = (new Date().getTime() - this._startingTime) * this.getCurrentSpeed();
    }

    /** 
     * @description Update duration of the piece according to the midi data
     */

  }, {
    key: '_updateDuration',
    value: function _updateDuration() {
      var duration = 0;
      if (this._events.length) {
        duration = this._events[this._events.length - 1].timestamp;
      } else if (this._playedEvents.length) {
        duration = this._playedEvents[this._playedEvents.length - 1].timestamp;
      }
      this._duration = duration;
    }

    /**
     * @description Wait until event.timestamp and currentTime are equal
     * @param {noteEvent}  event
     * @returns {Promise<void>}
     */

  }, {
    key: '_waitForEvent',
    value: function _waitForEvent(event) {
      this._currentTime = this.getCurrentTime();
      var deltaTime = event.timestamp - this._currentTime;
      var timeToWait = deltaTime / this.getCurrentSpeed();

      return new Promise(function (resolve) {
        return setTimeout(resolve, timeToWait);
      });
    }

    /**
     * @param {noteEvent} event
     */

  }, {
    key: '_handleEvent',
    value: function _handleEvent(event) {
      this.triggerCallbacks(event);
    }
  }]);
  return MidiPlayer;
}();

// objContainsObj
//
// checks if the original object has all keys of the comparison object and if the values are the same
//


var objContainsObj = function objContainsObj(original, comparison) {
  var originalKeys = Object.keys(original);
  var comparisonKeys = Object.keys(comparison);

  // Check if original has all keys of the comparison object
  if (!comparisonKeys.every(function (key) {
    return originalKeys.includes(key);
  })) {
    return false;
  }

  // Check if values are the same
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = comparisonKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (original[key] !== comparison[key]) {
        return false;
      }
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

  return true;
};

// locationOf
//
// returns the location where an element should be in a sorted array
//
var locationOf = function locationOf(element, array, comparer, start, end) {
  if (array.length === 0) {
    return -1;
  }
  start = start || 0;
  end = end || array.length;

  var middle = start + end >> 1; // should be faster than Math.floor(array.length / 2);

  var comparisonResult = comparer(element, array[middle]);
  comparisonResult = comparisonResult > 0 ? 1 : comparisonResult < 0 ? -1 : 0;

  if (end - start <= 1) {
    return comparisonResult === -1 ? middle : middle + 1;
  }

  switch (comparisonResult) {
    case -1:
      return locationOf(element, array, comparer, start, middle);
    case 0:
      return middle;
    case 1:
      return locationOf(element, array, comparer, middle, end);
  };
};

exports.default = MidiPlayer;
module.exports = exports['default'];

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(47);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(48), __esModule: true };

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25);
__webpack_require__(60);
module.exports = __webpack_require__(2).Array.from;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(14);
var defined = __webpack_require__(15);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(7) && !__webpack_require__(16)(function () {
  return Object.defineProperty(__webpack_require__(17)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(9);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(54);
var descriptor = __webpack_require__(18);
var setToStringTag = __webpack_require__(22);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(5)(IteratorPrototype, __webpack_require__(1)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(4);
var dPs = __webpack_require__(55);
var enumBugKeys = __webpack_require__(32);
var IE_PROTO = __webpack_require__(21)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(17)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(33).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(6);
var anObject = __webpack_require__(4);
var getKeys = __webpack_require__(28);

module.exports = __webpack_require__(7) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(12);
var toIObject = __webpack_require__(19);
var arrayIndexOf = __webpack_require__(57)(false);
var IE_PROTO = __webpack_require__(21)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(19);
var toLength = __webpack_require__(20);
var toAbsoluteIndex = __webpack_require__(58);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(14);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(12);
var toObject = __webpack_require__(23);
var IE_PROTO = __webpack_require__(21)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(8);
var $export = __webpack_require__(3);
var toObject = __webpack_require__(23);
var call = __webpack_require__(34);
var isArrayIter = __webpack_require__(35);
var toLength = __webpack_require__(20);
var createProperty = __webpack_require__(61);
var getIterFn = __webpack_require__(36);

$export($export.S + $export.F * !__webpack_require__(38)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(6);
var createDesc = __webpack_require__(18);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(63);


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(64);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 64 */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _promise = __webpack_require__(66);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(67), __esModule: true };

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(68);
__webpack_require__(25);
__webpack_require__(69);
__webpack_require__(73);
__webpack_require__(80);
__webpack_require__(81);
module.exports = __webpack_require__(2).Promise;


/***/ }),
/* 68 */
/***/ (function(module, exports) {



/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(70);
var global = __webpack_require__(0);
var hide = __webpack_require__(5);
var Iterators = __webpack_require__(10);
var TO_STRING_TAG = __webpack_require__(1)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(71);
var step = __webpack_require__(72);
var Iterators = __webpack_require__(10);
var toIObject = __webpack_require__(19);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(26)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(27);
var global = __webpack_require__(0);
var ctx = __webpack_require__(8);
var classof = __webpack_require__(37);
var $export = __webpack_require__(3);
var isObject = __webpack_require__(9);
var aFunction = __webpack_require__(11);
var anInstance = __webpack_require__(74);
var forOf = __webpack_require__(75);
var speciesConstructor = __webpack_require__(39);
var task = __webpack_require__(40).set;
var microtask = __webpack_require__(77)();
var newPromiseCapabilityModule = __webpack_require__(24);
var perform = __webpack_require__(41);
var promiseResolve = __webpack_require__(42);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(1)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(78)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(22)($Promise, PROMISE);
__webpack_require__(79)(PROMISE);
Wrapper = __webpack_require__(2)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(38)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(8);
var call = __webpack_require__(34);
var isArrayIter = __webpack_require__(35);
var anObject = __webpack_require__(4);
var toLength = __webpack_require__(20);
var getIterFn = __webpack_require__(36);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 76 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var macrotask = __webpack_require__(40).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(13)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(5);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(0);
var core = __webpack_require__(2);
var dP = __webpack_require__(6);
var DESCRIPTORS = __webpack_require__(7);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(3);
var core = __webpack_require__(2);
var global = __webpack_require__(0);
var speciesConstructor = __webpack_require__(39);
var promiseResolve = __webpack_require__(42);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(3);
var newPromiseCapability = __webpack_require__(24);
var perform = __webpack_require__(41);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(83), __esModule: true };

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(84);
var $Object = __webpack_require__(2).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(3);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(7), 'Object', { defineProperty: __webpack_require__(6).f });


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = __webpack_require__(86);

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(43);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(44);

var _createClass3 = _interopRequireDefault(_createClass2);

var _base = __webpack_require__(93);

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** typedef noteEvent
 * @typedef noteEvent
 * @property {int} channel
 * @property {int} note
 * @property {float|undefined} length
 * @property {float} timestamp
 * @property {int} track
 * @property {string} type
 * @property {int|undefined} velocity
 */

/**
 * @description Class for parsing raw midi data to an array of formatted noteOn/noteOff events
 */
var MidiParser = function () {
    function MidiParser() {
        (0, _classCallCheck3.default)(this, MidiParser);
    }

    (0, _createClass3.default)(MidiParser, [{
        key: 'parseText',

        /**
         * @param {string} text - midi in text/plain format
         * @returns {noteEvent[]}
         */
        value: function parseText(text) {
            try {
                var midiFile = MidiFile(text);
                var replayer = new Replayer(midiFile);
                var replayerData = replayer.getData();
                var formattedData = this._formatReplayerData(replayerData);
                return formattedData;
            } catch (event) {
                throw new Error(event);
            }
        }
        /**
         * @param {string} dataUrl - midi in b64 data url format
         * @returns {noteEvent[]}
         */

    }, {
        key: 'parseDataUrl',
        value: function parseDataUrl(dataUrl) {
            var data = _base2.default.atob(dataUrl.split(',')[1]);
            return this.parseText(data);
        }
        /**
         * @param {Uint8Array} uint8 - midi in Uint8Array format
         * @returns {noteEvent[]}
         */

    }, {
        key: 'parseUint8',
        value: function parseUint8(uint8) {
            var data = String.fromCharCode.apply(null, uint8);
            return this.parseText(data);
        }
        /**
         * @param {object[]} midiData - unformatted midi data from Replayer.getData()
         * @returns {noteEvent[]}
         */

    }, {
        key: '_formatReplayerData',
        value: function _formatReplayerData(midiData) {
            var data = midiData;
            var formattedData = [];

            // Change event format and drop unneccessary events
            for (var i = 0; i < data.length; i++) {
                var event = data[i];
                switch (event.subtype) {
                    case 'noteOn':
                    case 'noteOff':
                        var formattedEvent = {
                            channel: event.channel,
                            note: event.noteNumber,
                            timestamp: event.timestamp,
                            track: event.track,
                            type: event.subtype,
                            velocity: event.velocity
                        };
                        formattedData.push(formattedEvent);
                }
            }

            // Add length property to noteOn events
            for (var _i = 0; _i < formattedData.length; _i++) {
                if (formattedData[_i].type === 'noteOn') {
                    var noteOnEvent = formattedData[_i];
                    var noteOnKeyId = noteOnEvent.note;

                    // Search for following noteOff event
                    for (var n = _i + 1; n < formattedData.length; n++) {
                        var noteOffEvent = formattedData[n];
                        if (noteOffEvent.type === 'noteOff' && noteOnKeyId === formattedData[n].note) {
                            noteOnEvent.length = noteOffEvent.timestamp - noteOnEvent.timestamp;
                            break;
                        }
                    }
                }
            }

            return formattedData;
        }
    }]);
    return MidiParser;
}();

exports.default = MidiParser;

/* Note: The following code is an abstracted and slightly adapted version of jasmid
 * Github link:         https://github.com/gasman/jasmid
 */

/** Stream
 * Wrapper for accessing strings through sequential reads
 */

var Stream = function () {
    function Stream(str) {
        (0, _classCallCheck3.default)(this, Stream);

        this.str = str;
        this.position = 0;
    }

    (0, _createClass3.default)(Stream, [{
        key: 'read',
        value: function read(length) {
            var result = this.str.substr(this.position, length);
            this.position += length;
            return result;
        }
    }, {
        key: 'readInt32',
        value: function readInt32() {
            var result = (this.str.charCodeAt(this.position) << 24) + (this.str.charCodeAt(this.position + 1) << 16) + (this.str.charCodeAt(this.position + 2) << 8) + this.str.charCodeAt(this.position + 3);
            this.position += 4;
            return result;
        }
    }, {
        key: 'readInt16',
        value: function readInt16() {
            var result = (this.str.charCodeAt(this.position) << 8) + this.str.charCodeAt(this.position + 1);
            this.position += 2;
            return result;
        }
    }, {
        key: 'readInt8',
        value: function readInt8(signed) {
            var result = this.str.charCodeAt(this.position);
            if (signed && result > 127) result -= 256;
            this.position += 1;
            return result;
        }
    }, {
        key: 'eof',
        value: function eof() {
            return this.position >= this.str.length;
        }
        /*  read a MIDI-style letiable-length integer
            (big-endian value in groups of 7 bits,
            with top bit set to signify that another byte follows)
        */

    }, {
        key: 'readletInt',
        value: function readletInt() {
            var result = 0;
            while (true) {
                var b = this.readInt8();
                if (b & 0x80) {
                    result += b & 0x7f;
                    result <<= 7;
                } else {
                    /* b is the last byte */
                    return result + b;
                }
            }
        }
    }]);
    return Stream;
}();

/** MidiFile
class to parse the .mid file format
(depends on stream.js)
*/


function MidiFile(data) {
    function readChunk(stream) {
        var id = stream.read(4);
        var length = stream.readInt32();
        return {
            'id': id,
            'length': length,
            'data': stream.read(length)
        };
    }

    var lastEventTypeByte = void 0;

    function readEvent(stream) {
        var event = {};
        event.deltaTime = stream.readletInt();
        var eventTypeByte = stream.readInt8();
        if ((eventTypeByte & 0xf0) == 0xf0) {
            /* system / meta event */
            if (eventTypeByte == 0xff) {
                /* meta event */
                event.type = 'meta';
                var subtypeByte = stream.readInt8();
                var length = stream.readletInt();
                switch (subtypeByte) {
                    case 0x00:
                        event.subtype = 'sequenceNumber';
                        if (length != 2) throw "Expected length for sequenceNumber event is 2, got " + length;
                        event.number = stream.readInt16();
                        return event;
                    case 0x01:
                        event.subtype = 'text';
                        event.text = stream.read(length);
                        return event;
                    case 0x02:
                        event.subtype = 'copyrightNotice';
                        event.text = stream.read(length);
                        return event;
                    case 0x03:
                        event.subtype = 'trackName';
                        event.text = stream.read(length);
                        return event;
                    case 0x04:
                        event.subtype = 'instrumentName';
                        event.text = stream.read(length);
                        return event;
                    case 0x05:
                        event.subtype = 'lyrics';
                        event.text = stream.read(length);
                        return event;
                    case 0x06:
                        event.subtype = 'marker';
                        event.text = stream.read(length);
                        return event;
                    case 0x07:
                        event.subtype = 'cuePoint';
                        event.text = stream.read(length);
                        return event;
                    case 0x20:
                        event.subtype = 'midiChannelPrefix';
                        if (length != 1) throw "Expected length for midiChannelPrefix event is 1, got " + length;
                        event.channel = stream.readInt8();
                        return event;
                    case 0x2f:
                        event.subtype = 'endOfTrack';
                        if (length != 0) throw "Expected length for endOfTrack event is 0, got " + length;
                        return event;
                    case 0x51:
                        event.subtype = 'setTempo';
                        if (length != 3) throw "Expected length for setTempo event is 3, got " + length;
                        event.microsecondsPerBeat = (stream.readInt8() << 16) + (stream.readInt8() << 8) + stream.readInt8();
                        return event;
                    case 0x54:
                        event.subtype = 'smpteOffset';
                        if (length != 5) throw "Expected length for smpteOffset event is 5, got " + length;
                        var hourByte = stream.readInt8();
                        event.frameRate = {
                            0x00: 24,
                            0x20: 25,
                            0x40: 29,
                            0x60: 30
                        }[hourByte & 0x60];
                        event.hour = hourByte & 0x1f;
                        event.min = stream.readInt8();
                        event.sec = stream.readInt8();
                        event.frame = stream.readInt8();
                        event.subframe = stream.readInt8();
                        return event;
                    case 0x58:
                        event.subtype = 'timeSignature';
                        if (length != 4) throw "Expected length for timeSignature event is 4, got " + length;
                        event.numerator = stream.readInt8();
                        event.denominator = Math.pow(2, stream.readInt8());
                        event.metronome = stream.readInt8();
                        event.thirtyseconds = stream.readInt8();
                        return event;
                    case 0x59:
                        event.subtype = 'keySignature';
                        if (length != 2) throw "Expected length for keySignature event is 2, got " + length;
                        event.key = stream.readInt8(true);
                        event.scale = stream.readInt8();
                        return event;
                    case 0x7f:
                        event.subtype = 'sequencerSpecific';
                        event.data = stream.read(length);
                        return event;
                    default:
                        // console.log("Unrecognised meta event subtype: " + subtypeByte);
                        event.subtype = 'unknown';
                        event.data = stream.read(length);
                        return event;
                }
                event.data = stream.read(length);
                return event;
            } else if (eventTypeByte == 0xf0) {
                event.type = 'sysEx';
                var _length = stream.readletInt();
                event.data = stream.read(_length);
                return event;
            } else if (eventTypeByte == 0xf7) {
                event.type = 'dividedSysEx';
                var _length2 = stream.readletInt();
                event.data = stream.read(_length2);
                return event;
            } else {
                throw "Unrecognised MIDI event type byte: " + eventTypeByte;
            }
        } else {
            /* channel event */
            var param1 = void 0;
            if ((eventTypeByte & 0x80) == 0) {
                /* running status - reuse lastEventTypeByte as the event type.
                	eventTypeByte is actually the first parameter
                */
                param1 = eventTypeByte;
                eventTypeByte = lastEventTypeByte;
            } else {
                param1 = stream.readInt8();
                lastEventTypeByte = eventTypeByte;
            }
            var eventType = eventTypeByte >> 4;
            event.channel = eventTypeByte & 0x0f;
            event.type = 'channel';
            switch (eventType) {
                case 0x08:
                    event.subtype = 'noteOff';
                    event.noteNumber = param1;
                    event.velocity = stream.readInt8();
                    return event;
                case 0x09:
                    event.noteNumber = param1;
                    event.velocity = stream.readInt8();
                    if (event.velocity == 0) {
                        event.subtype = 'noteOff';
                    } else {
                        event.subtype = 'noteOn';
                    }
                    return event;
                case 0x0a:
                    event.subtype = 'noteAftertouch';
                    event.noteNumber = param1;
                    event.amount = stream.readInt8();
                    return event;
                case 0x0b:
                    event.subtype = 'controller';
                    event.controllerType = param1;
                    event.value = stream.readInt8();
                    return event;
                case 0x0c:
                    event.subtype = 'programChange';
                    event.programNumber = param1;
                    return event;
                case 0x0d:
                    event.subtype = 'channelAftertouch';
                    event.amount = param1;
                    return event;
                case 0x0e:
                    event.subtype = 'pitchBend';
                    event.value = param1 + (stream.readInt8() << 7);
                    return event;
                default:
                    throw "Unrecognised MIDI event type: " + eventType;
                /* 
                console.log("Unrecognised MIDI event type: " + eventType);
                stream.readInt8();
                event.subtype = 'unknown';
                return event;
                */
            }
        }
    }

    var stream = new Stream(data);
    var headerChunk = readChunk(stream);
    if (headerChunk.id != 'MThd' || headerChunk.length != 6) {
        throw "Bad .mid file - header not found";
    }
    var headerStream = new Stream(headerChunk.data);
    var formatType = headerStream.readInt16();
    var trackCount = headerStream.readInt16();
    var timeDivision = headerStream.readInt16();

    if (timeDivision & 0x8000) {
        throw "Expressing time division in SMTPE frames is not supported yet";
    }
    var ticksPerBeat = timeDivision;

    var header = {
        'formatType': formatType,
        'trackCount': trackCount,
        'ticksPerBeat': ticksPerBeat
    };
    var tracks = [];
    for (var i = 0; i < header.trackCount; i++) {
        tracks[i] = [];
        var trackChunk = readChunk(stream);
        if (trackChunk.id != 'MTrk') {
            throw "Unexpected chunk - expected MTrk, got " + trackChunk.id;
        }
        var trackStream = new Stream(trackChunk.data);
        while (!trackStream.eof()) {
            var event = readEvent(trackStream);
            tracks[i].push(event);
            //console.log(event);
        }
    }

    return {
        'header': header,
        'tracks': tracks
    };
}
function Replayer(midiFile) {
    var trackStates = [];
    var ticksPerBeat = midiFile.header.ticksPerBeat;

    var beatsPerMinute = 120;

    for (var i = 0; i < midiFile.tracks.length; i++) {
        trackStates.push({
            'nextEventIndex': 0,
            'ticksToNextEvent': midiFile.tracks[i].length ? midiFile.tracks[i][0].deltaTime : null
        });
    }

    function getNextEvent() {
        var ticksToNextEvent = null;
        var nextEventTrack = null;
        var nextEventIndex = null;

        for (var _i2 = 0; _i2 < trackStates.length; _i2++) {
            if (trackStates[_i2].ticksToNextEvent != null && (ticksToNextEvent == null || trackStates[_i2].ticksToNextEvent < ticksToNextEvent)) {
                ticksToNextEvent = trackStates[_i2].ticksToNextEvent;
                nextEventTrack = _i2;
                nextEventIndex = trackStates[_i2].nextEventIndex;
            }
        }
        if (nextEventTrack != null) {
            /* consume event from that track */
            var nextEvent = midiFile.tracks[nextEventTrack][nextEventIndex];
            if (midiFile.tracks[nextEventTrack][nextEventIndex + 1]) {
                trackStates[nextEventTrack].ticksToNextEvent += midiFile.tracks[nextEventTrack][nextEventIndex + 1].deltaTime;
            } else {
                trackStates[nextEventTrack].ticksToNextEvent = null;
            }
            trackStates[nextEventTrack].nextEventIndex += 1;
            /* advance timings on all tracks by ticksToNextEvent */
            for (var _i3 = 0; _i3 < trackStates.length; _i3++) {
                if (trackStates[_i3].ticksToNextEvent != null) {
                    trackStates[_i3].ticksToNextEvent -= ticksToNextEvent;
                }
            }
            return (0, _extends3.default)({}, nextEvent, {
                "ticksToEvent": ticksToNextEvent,
                "track": nextEventTrack
            });
        } else {
            return null;
        }
    };
    //
    var temporal = [];

    var midiEvent = null;
    var currentTime = 0;
    while (midiEvent = getNextEvent()) {
        if (midiEvent.type == "meta" && midiEvent.subtype == "setTempo") {
            // tempo change events can occur anywhere in the middle and affect events that follow
            beatsPerMinute = 60000000 / midiEvent.microsecondsPerBeat;
        }

        var secondsToGenerate = 0;
        if (midiEvent.ticksToEvent > 0) {
            var beatsToGenerate = midiEvent.ticksToEvent / ticksPerBeat;
            secondsToGenerate = beatsToGenerate / (beatsPerMinute / 60);
        }

        var deltaTime = secondsToGenerate * 1000 || 0;
        currentTime += deltaTime;

        midiEvent.timestamp = currentTime;
        temporal.push(midiEvent);
    }
    return {
        "getData": function getData() {
            return [].concat(temporal);
        }
    };
};
module.exports = exports['default'];

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(87);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(88), __esModule: true };

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(89);
module.exports = __webpack_require__(2).Object.assign;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(3);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(90) });


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(28);
var gOPS = __webpack_require__(91);
var pIE = __webpack_require__(92);
var toObject = __webpack_require__(23);
var IObject = __webpack_require__(29);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(16)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 91 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 92 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/* base64 polyfill
 * adapted version of https://github.com/davidchambers/Base64.js/blob/master/base64.js
 */

function InvalidCharacterError(message) {
    this.message = message;
}
InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var b64 = {};
b64.btoa = function (input) {
    var str = String(input);
    for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars, output = '';
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
        charCode = str.charCodeAt(idx += 3 / 4);
        if (charCode > 0xFF) {
            throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }
        block = block << 8 | charCode;
    }
    return output;
};
b64.atob = function (input) {
    var str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
    if (str.length % 4 == 1) {
        throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
    // and if not first of each 4 characters,
    // convert the first 8 bits to one ascii character
    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
    }
    return output;
};

exports.default = b64;
module.exports = exports['default'];

/***/ })
/******/ ]);
});