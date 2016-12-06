'use strict';

/**
 * lei-utils
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const fs = require('fs');
const util = require('util');
const events = require('events');
const crypto = require('crypto');
const stream = require('stream');
const utils = exports;


const BUG_FREE = require('./bugfree');

/**
 * 佛祖保佑，永无Bug
 * 图像来源于 https://github.com/ottomao/bugfreejs
 *
 * @param {Boolean} doNotOutput 设置为true时不自动打印，仅返回字符串
 * @return {String}
 */
exports.bugfree = function bugfree(doNotOutput) {
  if (doNotOutput) {
    return BUG_FREE;
  }
  console.log(BUG_FREE);
};

/**
 * format
 *
 * @param {String} str
 * @param {Mixed} param1
 * @param {Mixed} param2
 * @return {String}
 */
exports.format = util.format;

/**
 * 40位SHA1值
 *
 * @param {String} text 文本
 * @return {String}
 */
exports.sha1 = function sha1(text) {
  return crypto.createHash('sha1').update(utils.toBuffer(text)).digest('hex');
};

/**
 * 32位MD5值
 *
 * @param {String} text 文本
 * @return {String}
 */
exports.md5 = function md5(text) {
  return crypto.createHash('md5').update(utils.toBuffer(text)).digest('hex');
};

/**
 * 取文件内容的SHA1
 *
 * @param {String} filename
 * @param {Function} callback
 */
exports.fileSha1 = function fileSha1(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if (err) return callback(err);
    callback(null, utils.sha1(data));
  });
};

/**
 * 取文件内容的MD5
 *
 * @param {String} filename
 * @param {Function} callback
 */
exports.fileMd5 = function fileMd5(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if (err) return callback(err);
    callback(null, utils.md5(data));
  });
};

/**
 * 取哈希值
 *
 * @param {String} method 方法，如 md5, sha1, sha256
 * @param {String|Buffer} text 数据
 * @return {String}
 */
exports.hash = function hash(method, text) {
  return crypto.createHash(method).update(utils.toBuffer(text)).digest('hex');
};

/**
 * 加密密码
 *
 * @param {String} password
 * @return {String}
 */
exports.encryptPassword = function encryptPassword(password) {
  const random = utils.md5(Math.random() + '' + Math.random()).toUpperCase();
  const left = random.substr(0, 2);
  const right = random.substr(-2);
  const newpassword = utils.md5(left + password + right).toUpperCase();
  return [ left, newpassword, right ].join(':');
};

/**
 * 验证密码
 *
 * @param {String} password 待验证的密码
 * @param {String} encrypted 密码加密字符串
 * @return {Boolean}
 */
exports.validatePassword = function validatePassword(password, encrypted) {
  const random = encrypted.toUpperCase().split(':');
  if (random.length < 3) return false;
  const left = random[0];
  const right = random[2];
  const main = random[1];
  const newpassword = utils.md5(left + password + right).toUpperCase();
  return newpassword === main;
};

/**
 * 加密信息
 *
 * @param {Mixed} data
 * @param {String} secret
 * @return {String}
 */
exports.encryptData = function encryptData(data, secret) {
  const str = JSON.stringify(data);
  const cipher = crypto.createCipher('aes192', secret);
  let enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
};

/**
 * 解密信息
 *
 * @param {String} str
 * @param {String} secret
 * @return {Mixed}
 */
exports.decryptData = function decryptData(str, secret) {
  const decipher = crypto.createDecipher('aes192', secret);
  let dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  const data = JSON.parse(dec);
  return data;
};

/**
 * 产生随机字符串
 *
 * @param {Integer} size
 * @param {String} chars
 * @return {String}
 */
exports.randomString = function randomString(size, chars) {
  size = size || 6;
  chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const max = chars.length;
  let ret = '';
  for (let i = 0; i < size; i++) {
    ret += chars.charAt(Math.floor(Math.random() * max));
  }
  return ret;
};

/**
 * 产生随机数字字符串
 *
 * @param {Integer} size
 * @return {String}
 */
exports.randomNumber = function randomNumber(size) {
  return utils.randomString(size, '0123456789');
};

/**
 * 产生随机字母字符串
 *
 * @param {Integer} size
 * @return {String}
 */
exports.randomLetter = function randomLetter(size) {
  return utils.randomString(size, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
};

/**
 * 格式化日期时间
 *
 * @param {String} format
 * @param {String|Number|Date} timestamp
 * @return {String}
 */
exports.date = function date(format, timestamp) {
  //  discuss at: http://phpjs.org/functions/date/
  // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
  // original by: gettimeofday
  //    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: MeEtc (http://yass.meetcweb.com)
  // improved by: Brad Touesnard
  // improved by: Tim Wiel
  // improved by: Bryan Elliott
  // improved by: David Randall
  // improved by: Theriault
  // improved by: Theriault
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Theriault
  // improved by: Thomas Beaucourt (http://www.webapp.fr)
  // improved by: JT
  // improved by: Theriault
  // improved by: Rafał Kukawski (http://blog.kukawski.pl)
  // improved by: Theriault
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: majak
  //    input by: Alex
  //    input by: Martin
  //    input by: Alex Wilson
  //    input by: Haravikk
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: majak
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
  // bugfixed by: Chris (http://www.devotis.nl/)
  //        note: Uses global: php_js to store the default timezone
  //        note: Although the function potentially allows timezone info (see notes), it currently does not set
  //        note: per a timezone specified by date_default_timezone_set(). Implementers might use
  //        note: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
  //        note: in order to adjust the dates in this function (or our other date functions!) accordingly
  //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
  //   returns 1: '09:09:40 m is month'
  //   example 2: date('F j, Y, g:i a', 1062462400);
  //   returns 2: 'September 2, 2003, 2:26 am'
  //   example 3: date('Y W o', 1062462400);
  //   returns 3: '2003 36 2003'
  //   example 4: x = date('Y m d', (new Date()).getTime()/1000);
  //   example 4: (x+'').length == 10 // 2009 01 09
  //   returns 4: true
  //   example 5: date('W', 1104534000);
  //   returns 5: '53'
  //   example 6: date('B t', 1104534000);
  //   returns 6: '999 31'
  //   example 7: date('W U', 1293750000.82); // 2010-12-31
  //   returns 7: '52 1293750000'
  //   example 8: date('W', 1293836400); // 2011-01-01
  //   returns 8: '52'
  //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
  //   returns 9: '52 2011-01-02'

  let jsdate, f;
  // Keep this here (works, but for code commented-out below for file size reasons)
  // var tal= [];
  const txt_words = [
    'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  // trailing backslash -> (dropped)
  // a backslash followed by any character (including backslash) -> the character
  // empty string -> empty string
  const formatChr = /\\?(.?)/gi;
  const formatChrCb = function (t, s) {
    return f[t] ? f[t]() : s;
  };
  const _pad = function (n, c) {
    n = String(n);
    while (n.length < c) {
      n = '0' + n;
    }
    return n;
  };
  f = {
    // Day
    d() {
      // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2);
    },
    D() {
      // Shorthand day name; Mon...Sun
      return f.l()
        .slice(0, 3);
    },
    j() {
      // Day of month; 1..31
      return jsdate.getDate();
    },
    l() {
      // Full day name; Monday...Sunday
      return txt_words[f.w()] + 'day';
    },
    N() {
      // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7;
    },
    S() {
      // Ordinal suffix for day of month; st, nd, rd, th
      const j = f.j();
      let i = j % 10;
      if (i <= 3 && parseInt((j % 100) / 10, 10) === 1) {
        i = 0;
      }
      return [ 'st', 'nd', 'rd' ][i - 1] || 'th';
    },
    w() {
      // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay();
    },
    z() {
      // Day of year; 0..365
      const a = new Date(f.Y(), f.n() - 1, f.j());
      const b = new Date(f.Y(), 0, 1);
      return Math.round((a - b) / 864e5);
    },

    // Week
    W() {
      // ISO-8601 week number
      const a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
      const b = new Date(a.getFullYear(), 0, 4);
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
    },

    // Month
    F() {
      // Full month name; January...December
      return txt_words[6 + f.n()];
    },
    m() {
      // Month w/leading 0; 01...12
      return _pad(f.n(), 2);
    },
    M() {
      // Shorthand month name; Jan...Dec
      return f.F()
        .slice(0, 3);
    },
    n() {
      // Month; 1...12
      return jsdate.getMonth() + 1;
    },
    t() {
      // Days in month; 28...31
      return (new Date(f.Y(), f.n(), 0))
        .getDate();
    },

    // Year
    L() {
      // Is leap year?; 0 or 1
      const j = f.Y();
      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
    },
    o() {
      // ISO-8601 year
      const n = f.n();
      const W = f.W();
      const Y = f.Y();
      // eslint-disable-next-line
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
    },
    Y() {
      // Full year; e.g. 1980...2010
      return jsdate.getFullYear();
    },
    y() {
      // Last two digits of year; 00...99
      return f.Y()
        .toString()
        .slice(-2);
    },

    // Time
    a() {
      // am or pm
      return jsdate.getHours() > 11 ? 'pm' : 'am';
    },
    A() {
      // AM or PM
      return f.a()
        .toUpperCase();
    },
    B() {
      // Swatch Internet time; 000..999
      const H = jsdate.getUTCHours() * 36e2;
      // Hours
      const i = jsdate.getUTCMinutes() * 60;
      // Minutes
      const s = jsdate.getUTCSeconds(); // Seconds
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
    },
    g() {
      // 12-Hours; 1..12
      return f.G() % 12 || 12;
    },
    G() {
      // 24-Hours; 0..23
      return jsdate.getHours();
    },
    h() {
      // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2);
    },
    H() {
      // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2);
    },
    i() {
      // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2);
    },
    s() {
      // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2);
    },
    u() {
      // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6);
    },

    // Timezone
    e() {
      // Timezone identifier; e.g. Atlantic/Azores, ...
      // The following works, but requires inclusion of the very large
      // timezone_abbreviations_list() function.
      /*              return that.date_default_timezone_get();
       */
      throw new Error('Not supported (see source code of date() for timezone on how to add support)');
    },
    I() {
      // DST observed?; 0 or 1
      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
      // If they are not equal, then DST is observed.
      const a = new Date(f.Y(), 0);
      // Jan 1
      const c = Date.UTC(f.Y(), 0);
      // Jan 1 UTC
      const b = new Date(f.Y(), 6);
      // Jul 1
      const d = Date.UTC(f.Y(), 6); // Jul 1 UTC
      return ((a - c) !== (b - d)) ? 1 : 0;
    },
    O() {
      // Difference to GMT in hour format; e.g. +0200
      const tzo = jsdate.getTimezoneOffset();
      const a = Math.abs(tzo);
      return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
    },
    P() {
      // Difference to GMT w/colon; e.g. +02:00
      const O = f.O();
      return (O.substr(0, 3) + ':' + O.substr(3, 2));
    },
    T() {
      // Timezone abbreviation; e.g. EST, MDT, ...
      // The following works, but requires inclusion of the very
      // large timezone_abbreviations_list() function.
      /*              var abbr, i, os, _default;
      if (!tal.length) {
        tal = that.timezone_abbreviations_list();
      }
      if (that.php_js && that.php_js.default_timezone) {
        _default = that.php_js.default_timezone;
        for (abbr in tal) {
          for (i = 0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].timezone_id === _default) {
              return abbr.toUpperCase();
            }
          }
        }
      }
      for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
          os = -jsdate.getTimezoneOffset() * 60;
          if (tal[abbr][i].offset === os) {
            return abbr.toUpperCase();
          }
        }
      }
      */
      return 'UTC';
    },
    Z() {
      // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60;
    },

    // Full Date/Time
    c() {
      // ISO-8601 date.
      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
    },
    r() {
      // RFC 2822
      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
    },
    U() {
      // Seconds since UNIX epoch
      return jsdate / 1000 | 0;
    },
  };
  this.date = function (format, timestamp) {
    // eslint-disable-next-line
    jsdate = (timestamp === undefined ? new Date() : // Not provided
      (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
        new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
      );
    return format.replace(formatChr, formatChrCb);
  };
  return this.date(format, timestamp);
};

/**
 * 空白回调函数
 *
 * @param {Error} err
 */
exports.noop = function noop(err) {
  if (err) {
    console.error('noop callback: %s', err);
  }
};

/**
 * 是否为字符串
 *
 * @param {Mixed} str
 * @return {Boolean}
 */
exports.isString = function isString(str) {
  return (typeof str === 'string');
};

/**
 * 是否为整数
 *
 * @param {Mixed} str
 * @return {Boolean}
 */
exports.isInteger = function isInteger(str) {
  return (Math.round(str) === Number(str));
};

/**
 * 是否为数字
 *
 * @param {Mixed} str
 * @return {Boolean}
 */
exports.isNumber = function isNumber(str) {
  return (!isNaN(str));
};

/**
 * 复制对象
 *
 * @param {Object} obj
 * @return {Object}
 */
exports.cloneObject = function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * 合并对象
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 */
exports.merge = function merge() {
  const ret = {};
  for (let i = 0; i < arguments.length; i++) {
    const obj = arguments[i];
    Object.keys(obj).forEach(function (k) {
      ret[k] = obj[k];
    });
  }
  return ret;
};

/**
 * 返回安全的JSON字符串
 *
 * @param {Object} data
 * @param {String|Number} space 缩进
 * @return {String}
 */
exports.jsonStringify = function jsonStringify(data, space) {
  const seen = [];
  return JSON.stringify(data, function (key, val) {
    if (!val || typeof val !== 'object') {
      return val;
    }
    if (seen.indexOf(val) !== -1) {
      return '[Circular]';
    }
    seen.push(val);
    return val;
  }, space);
};

/**
 * 将arguments对象转换成数组
 *
 * @param {Object} args
 * @return {Array}
 */
exports.argumentsToArray = function argumentsToArray(args) {
  return Array.prototype.slice.call(args);
};

/**
 * 取数组的最后一个元素
 *
 * @param {Array} arr
 * @return {Object}
 */
exports.getArrayLastItem = function getArrayLastItem(arr) {
  return arr[arr.length - 1];
};

/**
 * 异步函数节流
 *
 * @param {Function} fn 函数最后一个参数必须为回调函数，且回调函数第一个参数为 err
 * @param {Number} maxCcoun
 * @return {Function}
 */
exports.throttleAsync = function throttleAsync(fn, maxCount) {
  if (!(maxCount > 1)) maxCount = 1;
  let counter = 0;
  return function () {
    const args = utils.argumentsToArray(arguments);
    const callback = utils.getArrayLastItem(args);
    if (counter >= maxCount) return callback(new Error('throttleAsync() out of limit'));
    args.pop();
    args.push(function () {
      counter -= 1;
      callback.apply(null, arguments);
    });
    counter += 1;
    fn.apply(null, args);
  };
};

/**
 * 继承EventEmitter
 *
 * @param {Function} fn
 * @param {Object}
 */
exports.inheritsEventEmitter = function inheritsEventEmitter(fn) {
  return util.inherits(fn, events.EventEmitter);
};

/**
 * 继承
 *
 * @param {Function} fn
 * @param {Function} superConstructor
 * @return {Object}
 */
exports.inherits = function inherits(fn, superConstructor) {
  return util.inherits(fn, superConstructor);
};

/**
 * 扩展utils
 *
 * @param {Object} obj
 * @return {Object}
 */
exports.extend = function extend(obj) {
  return utils.merge(exports, obj);
};
exports.extends = exports.extend;

exports.array = {};

/**
 * 取数组最后一个元素
 *
 * @param {Array} arr
 * @return {Object}
 */
exports.array.last = function last(arr) {
  return arr[arr.length - 1];
};

/**
 * 取数组第一个元素
 *
 * @param {Array} arr
 * @return {Object}
 */
exports.array.head = function head(arr) {
  return arr[0];
};

/**
 * 取数组第一个元素
 *
 * @param {Array} arr
 * @return {Object}
 */
exports.array.first = function first(arr) {
  return arr[0];
};

/**
 * 取数组除第一个之外的元素
 *
 * @param {Array} arr
 * @return {Object}
 */
exports.array.rest = function rest(arr) {
  return arr.slice(1);
};

/**
 * 复制一个数组
 *
 * @param {Array} arr
 * @return {Object}
 */
exports.array.copy = function copy(arr) {
  return arr.slice();
};

/**
 * 组合一组数组
 *
 * @param {Array} a
 * @param {Array} b
 * @return {Object}
 */
exports.array.concat = function concat() {
  const ret = [];
  return ret.concat.apply(ret, arguments);
};

/**
 * 生成自定义Error类型
 *
 * @param {String} name
 * @param {Object} info
 * @return {Function}
 */
exports.customError = function customError(name, info) {
  name = name || 'CustomError';
  info = info || {};
  const code = '' +
'function ' + name + '(message, info2) {\n' +
'  Error.captureStackTrace(this, ' + name + ');\n' +
'  this.name = "' + name + '";\n' +
'  this.message = (message || "");\n' +
'  info2 = info2 || {};\n' +
'  for (var i in info) this[i] = info[i];\n' +
'  for (var i in info2) this[i] = info2[i];\n' +
'}\n' +
name + '.prototype = Error.prototype;' + name;
  return eval(code);
};

/**
 * 判断是否为Promise对象
 *
 * @param {Object} p
 * @return {Boolean}
 */
exports.isPromise = function isPromise(p) {
  return (p && typeof p.then === 'function' && typeof p.catch === 'function');
};

exports.promise = {};

/**
 * 调用异步函数（传参时不包含末尾的callback），返回一个Promise对象
 *
 * @param {Function} fn
 * @return {Object}
 */
exports.promise.call = function call(fn) {
  const args = utils.argumentsToArray(arguments).slice(1);
  return new Promise(function (resolve, reject) {
    args.push(function (err, ret) {
      if (err) {
        reject(err);
      } else {
        resolve(ret);
      }
    });
    let ret;
    try {
      ret = fn.apply(null, args);
    } catch (err) {
      return reject(err);
    }
    if (utils.isPromise(ret)) {
      ret.then(resolve).catch(reject);
    }
  });
};

/**
 * 等待所有Promise执行完毕
 *
 * @param {Array} _args
 * @return {Object}
 */
exports.promise.all = function all(_args) {
  const args = Array.isArray(_args) ? _args : utils.argumentsToArray(arguments);
  return new Promise(function (resolve, reject) {
    const results = [];
    let counter = 0;
    function check() {
      counter += 1;
      if (counter === args.length) {
        resolve(results);
      }
    }
    args.forEach(function (p, i) {
      p.then(function (ret) {
        results[i] = [ null, ret ];
        check();
      }).catch(function (err) {
        results[i] = [ err ];
        check();
      });
    });
  });
};

/**
 * 将IP地址转换为long值
 *
 * 例：   ipToInt('192.0.34.166')    ==> 3221234342
 *       ipToInt('255.255.255.256') ==> false
 *
 * @param {String} ip
 * @return {Number}
 */
exports.ipToInt = function ipToInt(ip) {
  const s = ip.split('.');
  if (s.length !== 4) return false;
  for (let i = 0; i < 4; i++) {
    const v = s[i] = parseInt(s[i], 10);
    if (v < 0 || v > 255) return false;
  }
  return s[0] * 16777216 + s[1] * 65536 + s[2] * 256 + s[3];
};

/**
 * 将字符串转换为 Buffer
 *
 * @param {String} data
 * @return {Buffer}
 */
exports.toBuffer = function toBuffer(data) {
  if (Buffer.isBuffer(data)) return data;
  if (typeof data === 'string') return new Buffer(data);
  throw new Error('invalid data type, must be string or buffer');
};

/**
 * 使用指定方法加密数据
 *
 * @param {String} algorithm
 * @param {String|Buffer} key
 * @param {Buffer} data
 * @return {Buffer}
 */
exports.encrypt = function encrypt(algorithm, key, data) {
  key = Buffer.isBuffer(key) ? key : keyHash(key);
  data = utils.toBuffer(data);
  const cipher = crypto.createCipheriv(algorithm, key, new Buffer(0));
  const encrypted = [ cipher.update(data), cipher.final() ];
  return Buffer.concat(encrypted);
};

/**
 * 使用指定方法加密数据流
 *
 * @param {String} algorithm
 * @param {String|Buffer} key
 * @param {Stream} inStream
 * @return {Stream}
 */
exports.encryptStream = function encryptStream(algorithm, key, inStream) {
  key = Buffer.isBuffer(key) ? key : keyHash(key);
  const cipher = crypto.createCipheriv(algorithm, key, new Buffer(0));
  return inStream.pipe(cipher);
};

/**
 * 使用指定方法解密数据
 *
 * @param {String} algorithm
 * @param {String|Buffer} key
 * @param {Buffer} data
 * @return {Buffer}
 */
exports.decrypt = function decrypt(algorithm, key, data) {
  key = Buffer.isBuffer(key) ? key : keyHash(key);
  data = utils.toBuffer(data);
  const cipher = crypto.createDecipheriv(algorithm, key, new Buffer(0));
  const encrypted = [ cipher.update(data), cipher.final() ];
  return Buffer.concat(encrypted);
};

/**
 * 使用指定方法解密数据流
 *
 * @param {String} algorithm
 * @param {String|Buffer} key
 * @param {Stream} inStream
 * @return {Stream}
 */
exports.decryptStream = function decryptStream(algorithm, key, inStream) {
  key = Buffer.isBuffer(key) ? key : keyHash(key);
  const cipher = crypto.createDecipheriv(algorithm, key, new Buffer(0));
  return inStream.pipe(cipher);
};

function keyHash(data) {
  data = utils.toBuffer(data);
  return crypto.createHash('sha256').update(data).digest();
}

/**
 * 创建 hash 的转换流
 *
 * @param {String} method 方法，如 md5, sha1, sha256
 * @return {Stream}
 */
exports.hashTransform = function hashTransform(method, callback) {
  const cipher = crypto.createHash(method);
  const transform = new stream.Transform({
    transform(chunk, encoding, callback) {
      cipher.update(chunk, encoding);
      this.push(chunk);
      callback();
    },
  });
  transform.once('finish', () => callback(null, cipher.digest()));
  return transform;
};

/**
 * 创建一个带 promise 的回调函数
 *
 * @return {Function}
 */
exports.createPromiseCallback = function createPromiseCallback() {
  const callback = (err, ret) => {
    if (err) {
      callback.reject(err);
    } else {
      callback.resolve(ret);
    }
  };
  callback.promise = new Promise((resolve, reject) => {
    callback.resolve = resolve;
    callback.reject = reject;
  });
  return callback;
};
