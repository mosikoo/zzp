const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

function alterPkg(content) {
  const pkgPath = path.resolve(content.cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = require(pkgPath);
    if (pkg.version === content.version) {
      return false;
    }
    try {
      pkg.version = content.version;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
      return true;
    } catch (err) {
      return false;
    }
  } 
}

/*
 * 1. git status
 * 2. git fetch origin 
 * 3. git merge origin/master
 * 4. nowa build (如果isBuild: true)
 * 5. 修改package的版本号 (如果package存在且版本号与当前不符)
 * 6. git add .
 * 7. git commit 
 * 8. git push daily/x.x.x (如果type为daily，到此结束)
 * 9. git tag 
 * 10. git push origin publish/x.x.x
 */
function getCommnads (content) {
  var isAlterPkg = false;
  const commands = [
    {
      command: 'git status',
      errfn: function(data) { // working tree 必须清空
        if (data.indexOf('working tree clean') === -1) {
          console.log(chalk.red('Error: You must clean working tree before any operation!'));
          content.isError = true;
          content.reason = 'working tree is not clean';
        }
      }
    },
    {
      command: 'git fetch origin'
    },
    {
      command: 'git merge origin/master',
      errfn: function(data) { // 根据data信息判断错误，git push 空内容就会被视为错误，无规律可寻
        if (~data.indexOf('Merge conflict')) {
          console.log(chalk.red('Error: These are some conflicts when merging other branch!'));
          console.log(chalk.red('       Please fix conflicts first'));
          content.isError = true;
          content.reason = 'merge conflit';
          // todo :如果只是dist下文件冲突且有nowa build，可以不报错，继续执行
        }
      }
    },
    {
      command: 'git add .',
      preAction(content) {
        isAlterPkg = alterPkg(content) || false;
      }
    },
    {
      command: function(){
        return `git commit -m\'merge${content.isBuild ? ' & build' : ''}${isAlterPkg ? ' & alter version of package.json' : ''}\'`
      }
    },
    {
      command: `git push origin daily/${content.version}`
    },
  ];

  if (content.isBuild) {
    commands.splice(4, 0, 
      {
        command: 'nowa build'
      });
  }

  if (content.type === 'publish') {
    commands.splice(commands.length, 0, 
    {
      command: `git tag publish/${content.version}`
    },{
      command: `git push origin -u publish/${content.version}`
    });
  }

  return commands;
}

module.exports = getCommnads;
