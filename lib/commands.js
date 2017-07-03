const chalk = require('chalk');

function getCommnads (content) {
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
      command: `git push origin ${content.type}/${content.version}`
    },
  ];

  if (content.isBuild) {
    commands.splice(1, 0, {
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
        }
      }
    },
    {
      command: 'nowa build'
    },
    {
      command: 'git add .'
    },
    {
      command: 'git commit -m\'build\''
    });
  }

  if (content.type === 'publish') {
    commands.splice(commands.length - 1, 1, {
      command: `git tag publish/${content.version}`
    },{
      command: `git push origin -u publish/${content.version}`
    });
  }

  return commands;
}

module.exports = getCommnads;
