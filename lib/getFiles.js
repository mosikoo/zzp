/*
 * 判断当前文件夹下的项目环境:
 * 1、存在「.git目录」，指定为项目环境
 * 2、该目录下所有的项目（包含「.git目录」）
 * 3、不是以上两种情况则退出
 */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const utils = require('./utils');

const files = fs.readdirSync(path.resolve(process.cwd()));
const fileChoices = [];

function getCurrentDirName(path) {
  if (path) {
    const results = path.match(/\/(.+)$/); // window 换种方式
  }
}
/*
 * 根据目录路径,获取文件名及分支名，push到fileChoices中
 */
function setStat (filePath) {
  if (fs.statSync(filePath).isFile()) {
    return;
  }
  const filename = path.basename(filePath);
  if (~fs.readdirSync(filePath).indexOf('.git')) {
    const output = fs.readFileSync(path.resolve(filePath, utils.gitHead), 'utf-8');
    const result = output.match(/refs\/heads\/(.+)/);
    if (result && result[1]) {
      fileChoices.push({
        branch: result[1],
        filename
      });
    }
  }
}

if (~files.indexOf('.git')) {
  // 为git目录
  setStat(process.cwd());
} else {
  files.forEach((file) => {
    setStat(path.resolve(process.cwd(), file));
  });
}

if (fileChoices.length === 0) {
  console.log(`${chalk.red(`Error: There is no operation in current Dir(${chalk.green(process.cwd())}).`)}`);
  console.log(`${chalk.red('       Please execute 「aopu」 in right Dir which has 「.git」 Dir!')}`);
}

module.exports = fileChoices;
