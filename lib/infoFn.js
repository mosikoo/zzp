const chalk = require('chalk');
const addStars = require('./utils').addStars;

function helpInfo () {
  console.log('\n  Usage: aopu [options]');
  console.log('\n\n  Options:')
  console.log('\n  -h, --help     output usage information');
  console.log('\n  -v, --version  output the version number');
}

function statInfo(info) {
  addStars('end');  
  console.log('\n\n');
  addStars('statistics');
  console.log('* the publish information for selected projects:')
  info.forEach((item) => {
    if (item.isError) {
      console.log(`*   ${chalk.yellow(item.name)}: ${chalk.red('Error')}(${item.reason})`);
    } else {
      console.log(`*   ${chalk.yellow(item.name)}: ${chalk.green('Success')}`);
    }
  });
  addStars('end');
}

function pubInfo(info) {
  addStars('end');  
  console.log('\n\n');
  addStars('confirm the publish project');
  info.forEach((item) => {
    console.log(`*   ${chalk.yellow(item.name)}: ${chalk.green(`${item.type}/${item.version}`)}`);
  });
}

module.exports = {
  helpInfo,
  statInfo,
  pubInfo
};
