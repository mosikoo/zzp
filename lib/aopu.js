const inquirer = require('inquirer');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const child_process = require('child_process');
const utils = require('./utils');
const files = require('./getfiles');
const qs = require('./questions');
const infoFn = require('./infoFn');
const getCommnads = require('./commands');

const log = utils.log;
const addStars = require('./utils').addStars;

function execSh(item, content) {
  return new Promise((resolve, reject) => {
    const command = typeof item.command === 'function' ? item.command() : item.command;
    console.log((`\n${chalk.cyan('executing:')} ${chalk.red(command)}`));
    item.preAction && item.preAction(content);
    const ls = child_process.exec(command, { cwd: content.cwd });
    ls.stdout.on('data', function(data) {
      console.log(data);
      item.errfn && item.errfn(data);
    });
    ls.stderr.on('data', function(data) {
      console.log(data);
      item.errfn && item.errfn(data);
    });
    ls.on('close', () => {
      resolve();
    });
  });
}

var execCommand = async function (info) {
  for (var j = 0; j < info.length; j += 1) {
    const content = info[j];
    await (function () {
      return new Promise((resolve) => {
        if (j !== 0) {
          addStars('end');  
          console.log('\n\n');
        }
        addStars(content.name);
        const commands = getCommnads(info[j]);
        (async function(){
          for (var i = 0; i < commands.length; i += 1) {
            if (content.isError) {
              break;
            }
            await execSh(commands[i], content);
          }
          resolve()
        })();
      })
    })();
  }
  // 统计发布信息
  infoFn.statInfo(info);
}

const info = [];
const defaultData = {}; // 默认选项
var globalContent; // 记录content
function recursiveQuestion(content, index) {
  if (content.files.length <= index) {
    infoFn.pubInfo(info)
    inquirer.prompt(qs.confirmQuestion).then(subContent => {
      addStars('end');  
      console.log('\n\n');
      if (subContent.isOk) {
        execCommand(info);
      } else {
        info.length = 0;
        recursiveQuestion(globalContent, 0);
      }
    });

    return;
  }
  const name = content.files[index];
  if (index !== 0) {
    addStars('end');  
    console.log('\n\n');
  }
  addStars(name);
  inquirer.prompt(qs.questions(name, defaultData, content.isCurrentDir)).then(subContent => {
    defaultData.type = subContent.type; // 记忆type类型为默认值
    defaultData.isBuild = subContent.isBuild; // 记忆isBuild值为默认值
    const cwd = content.isCurrentDir ? process.cwd() : path.resolve(process.cwd(), name);
    info.push(Object.assign({}, { name, cwd }, subContent));
    recursiveQuestion(content, index + 1)
  });
}
function pub () {
  if (qs.fileChoiceQuestion.type) {
    inquirer.prompt(qs.fileChoiceQuestion).then((content) => {
      globalContent = content;
      recursiveQuestion(content, 0);
    });
  } else {
    const content = globalContent = {
      files: [path.basename(process.cwd())],
      isCurrentDir: true
    };
    recursiveQuestion(content, 0);
  }
}

const args = process.argv.slice(2);
if (args.length) {
  if (args.length === 1 && (args[0] === '-V' || args[0] === '--version')) {
    console.log(require('../package.json').version);
  } else {
    infoFn.helpInfo();
  }
} else {
  pub();
}

