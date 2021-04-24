const chalk = require('chalk');
const findUnusedModule = require('../src/index');

const { all, used, unused } = findUnusedModule({
    cwd: process.cwd(),
    entries: ['./demo-project/fre.js', './demo-project/suzhe2.js'],
    includes: ['./demo-project/**/*'],
    aliasMap: {
        'a': './lib/ssh.js'
    }    
});

console.log(chalk.blue('used modules:'));
console.log(used);
console.log(chalk.yellow('unused modules:'));
console.log(unused);
