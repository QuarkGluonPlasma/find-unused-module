const chalk = require('chalk');
const findUnusedModule = require('../src/index');
const path = require('path');

const { all, used, unused } = findUnusedModule({
    cwd: process.cwd(),
    entries: ['./demo-project/fre.js', './demo-project/suzhe2.js'],
    includes: ['./demo-project/**/*'],
    resolveRequirePath (curDir, requirePath) {
        if (requirePath === 'b') {
            return path.resolve(curDir, './lib/ssh.js');
        }
        return requirePath;
    }
});

console.log(chalk.blue('used modules:'));
console.log(used);
console.log(chalk.yellow('unused modules:'));
console.log(unused);
