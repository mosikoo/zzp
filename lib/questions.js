const fs = require('fs');
const chalk = require('chalk')
const path = require('path');
const fileChoices = require('./getFiles');
const config = require('./config');

const fileChoiceQuestion = {
  message: 'choice the project name that you want to publish',
  name: 'files',
  validate(answer) {
    if (answer.length < 1) {
        return 'You must choose at least one topping.';
      }
    return true;
  }
}

if (fileChoices.length > 1) {
  fileChoiceQuestion.type = 'checkbox';
  fileChoiceQuestion.choices = fileChoices.map(item => ({ name: item.filename }));
}

const questions = (filename, defaultData, isCurrentDir) => ([
  {
    type: 'list',
    name: 'type',
    message: 'which environment will you publish, daily or publish？',
    choices: ['daily', 'publish'],
    default() {
      return defaultData && defaultData.type || 'daily';
    }
  },
  {
    type: 'input',
    name: 'version',
    message: 'Please input the project version, i.e. "1.0.1". ',
    default: function() {
      const _filename = isCurrentDir ? '' : filename;
      const output = fs.readFileSync(path.resolve(process.cwd(), _filename, config.gitHead), 'utf-8');
      const result = output.match(/refs\/heads\/daily\/(([0-9]{1,2}\.){2}[0-9]{1,2})/);
      return result && result[1] || '';
    },
    validate: function(version) {
      if(/^([0-9]{1,2}\.){2}[0-9]{1,2}$/.test(version)) {
        var files = [];
        try {
          // git文件取branch得优化下。
          const _filename = isCurrentDir ? '' : filename;
          files = fs.readdirSync(path.resolve(process.cwd(), _filename, config.gitDirBranch));
        } catch(err) {
          console.log(`\n  ${chalk.red('The git branch is non-existent!')}`);
        }
        if (~files.indexOf(version)) {
          return true;
        }
        return 'the version is non-existent, input again！'
      }
      return 'Please input the correct version, i.e. "1.0.1"'
    }
  },
  {
    type: 'confirm',
    default() {
      return defaultData && defaultData.isBuild || false;
    },
    name: 'isBuild',
    message: `is 『nowa build』? (${defaultData && defaultData.isBuild ? 'yes' : 'no'}).`
  }
]);

module.exports = {
  questions,
  fileChoiceQuestion,
};