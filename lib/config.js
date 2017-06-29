function getCommnads (content) {
  const commands = [
    {
      command: 'git fetch origin',
      err: ''
    },
    {
      command: 'git merge origin/master',
      err: ''
    },
    {
      command: 'git add .',
      err: ''
    },
    {
      command: 'git commit -m\'build\'',
      err: ''
    },
    {
      command: `git push origin ${content.type}/${content.version}`,
      err: ''
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
  commands: getCommnads
};
