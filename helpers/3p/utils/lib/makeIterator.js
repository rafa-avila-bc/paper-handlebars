/*!
 * COPY of https://raw.githubusercontent.com/jonschlinkert/make-iterator/0.2.0/index.js
 */
'use strict';

const forOwn = require('./forOwn');

module.exports = function makeIterator(src, thisArg) {
  if (src === null) {
    return noop;
  }

  switch (typeof src) {
    // function is the first to improve perf (most common case)
    // also avoid using `Function#call` if not needed, which boosts
    // perf a lot in some cases
    case 'function':
      return (typeof thisArg !== 'undefined') ? function (val, i, arr) {
        return src.call(thisArg, val, i, arr);
      } : src;
    case 'object':
      return function (val) {
        return deepMatches(val, src);
      };
    case 'string':
    case 'number':
      return prop(src);
    }
};

function containsMatch(array, value) {
  var len = array.length;
  var i = -1;

  while (++i < len) {
    if (deepMatches(array[i], value)) {
      return true;
    }
  }
  return false;
}

function matchArray(o, value) {
  var len = value.length;
  var i = -1;

  while (++i < len) {
    if (!containsMatch(o, value[i])) {
      return false;
    }
  }
  return true;
}

function matchObject(o, value) {
  var res = true;
  forOwn(value, function (val, key) {
    if (!deepMatches(o[key], val)) {
      // Return false to break out of forOwn early
      return (res = false);
    }
  });
  return res;
}

/**
 * Recursively compare objects
 */

function deepMatches(o, value) {
  if (o && typeof o === 'object') {
    if (Array.isArray(o) && Array.isArray(value)) {
      return matchArray(o, value);
    } else {
      return matchObject(o, value);
    }
  } else {
    return o === value;
  }
}

function prop(name) {
  return function(obj) {
    return obj[name];
  };
}

function noop(val) {
  return val;
}