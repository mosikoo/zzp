const chalk = require('chalk');
function getCommnads (content) {
  const commands = [
    {
      command: 'git status',
      errfn: function(data) { // working tree 必须清空
        if (data.indexOf('working tree clean') === -1) {
          console.log(chalk.red('Error: You must clean working tree before any operation!'));
          process.exit(0);
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
          process.exit(0);
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
    },
    {
      command: `git push origin ${content.type}/${content.version}`
    },
  ];

  if (content.type === 'publish') {
    commands.splice(4, 1, {
      command: `git tag publish/${content.version}`,
      err: ''
    },{
      command: `git push origin -u publish/${content.version}`,
      err: ''
    });
  }

  return commands;
}

module.exports = {
  gitDirBranch: '.git/refs/heads/daily', // git相对地址,
  gitHead: '.git/HEAD',
  commands: getCommnads
};
