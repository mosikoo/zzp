const chalk = require('chalk');
function helpInfo () {
  console.log('\n  Usage: aopu [options]');
  console.log('\n\n  Options:')
  console.log('\n  -h, --help     output usage information');
  console.log('\n  -v, --version  output the version number');
}

function statInfo(info) {
  console.log(`===================${chalk.green('end')}=====================\n\n\n`);
  console.log(`=================${chalk.green('statistics')}===================\n`);
  console.log('the publish information for selected projects:\n')
  info.forEach((item) => {
    if (item.isError) {
      console.log(`  ${chalk.yellow(item.name)}: ${chalk.red('Error')}(${item.reason})`);
    } else {
      console.log(`  ${chalk.yellow(item.name)}: ${chalk.green('Success')}`);
    }
  });
}

module.exports = {
  helpInfo,
  statInfo
};
