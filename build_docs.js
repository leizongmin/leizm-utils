'use strict';

/**
 * lei-utils build docs
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const utils = require('./');


function getFunctionArguments(fn) {
  return fn.toString().split('\n')[0].match(/function.*\((.*)\)\s*\{/)[1].split(',').map(function (a) { return a.trim(); });
}

const list = [];
for (const i in utils) {
  if (typeof utils[i] === 'function') {
    list.push('+ `' + i + ' (' + getFunctionArguments(utils[i]).join(', ') + ')`');
  } else {
    list.push('+ `' + i + '`');
    for (const j in utils[i]) {
      if (typeof utils[i][j] === 'function') {
        list.push('  + `' + j + ' (' + getFunctionArguments(utils[i][j]).join(', ') + ')`');
      }
    }
  }
}

const README_FILE = path.resolve(__dirname, 'README.md');
const README_FILE_TPL = path.resolve(__dirname, 'README.tpl.md');
const tpl = fs.readFileSync(README_FILE_TPL).toString();
fs.writeFileSync(README_FILE, tpl.replace(/\{\{EXPORTS\}\}/g, list.join('\n')));

console.log(list.join('\n'));
console.log('done.');
