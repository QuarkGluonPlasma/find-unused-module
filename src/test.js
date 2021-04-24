const chalk = require('chalk');
const findUnusedModule = require('./index');

const { all, used, unused } = findUnusedModule({
    entries: ['./demo-project/fre.js', './demo-project/suzhe2.js'],
    includes: ['./demo-project/**/*']
});

console.log(chalk.blue('used modules:'));
console.log(used);
console.log(chalk.yellow('unused modules:'));
console.log(unused);
