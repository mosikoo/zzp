const chalk = require('chalk');

function log(str) {
  console.log(`* ${str}`);
}

function repeatNum(str, len) {
  var s = '';
  while(len--) {
    s += str;
  }
  return s;
}

function addStars(str, len) {
  if (!len) {
    len = 70;
  }
  if (!str) {
    str = ''
  }
  if (len < str.len) {
    return str;
  }
  const starLen = parseInt((len - str.length) / 2);
  console.log(`${repeatNum('*', starLen)}${chalk.green(str)}${repeatNum('*', starLen)}${((len - str.length) % 2 ? '*' : '')}`);
}


module.exports = {
  gitDirBranch: '.git/refs/heads/daily', // git相对地址,
  gitHead: '.git/HEAD', // 当前git分支
  log,
  addStars
};
