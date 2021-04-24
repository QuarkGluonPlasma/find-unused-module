Scan unused module under a directory, support many module require method and custom module path resolver.

supported module require:
- [x] es module import
- [x] commonjs require 
- [x] css、less、scss @import
- [x] css、less、scss url()

## Usage

quick test:

```
yarn

yarn test
```

use findUnusedModule api:

```javascript
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
```

output:
```
used modules:
[
  '/xx/find-unused-module/demo-project/render.js',
  '/xx/find-unused-module/demo-project/diff.js',
  '/xx/find-unused-module/demo-project/dom.js',
  '/xx/find-unused-module/demo-project/h.js',
  '/xx/find-unused-module/demo-project/component.js',
  '/xx/find-unused-module/demo-project/set-state-queue.js',
  '/xx/find-unused-module/demo-project/diff.js',
  '/xx/find-unused-module/demo-project/dom.js',
  '/xx/find-unused-module/demo-project/watcher.js',
  '/xx/find-unused-module/demo-project/dep.js',
  '/xx/find-unused-module/demo-project/diff.js',
  '/xx/find-unused-module/demo-project/dom.js',
  '/xx/find-unused-module/demo-project/observer.js',
  '/xx/find-unused-module/demo-project/dep.js',
  '/xx/find-unused-module/demo-project/lib/ssh.js',
  '/xx/find-unused-module/demo-project/guang.tsx',
  '/xx/find-unused-module/demo-project/style.css',
  '/xx/find-unused-module/demo-project/styles/common.css',
  '/xx/find-unused-module/demo-project/style2.less',
  '/xx/find-unused-module/demo-project/styles/common2.less',
  '/xx/find-unused-module/demo-project/style3.scss',
  '/xx/find-unused-module/demo-project/styles/common3.scss',
  '/xx/find-unused-module/demo-project/styles/ssh.jpeg',
  '/xx/find-unused-module/demo-project/styles/a.eot'
]
unused modules:
[
  '/xx/find-unused-module/./demo-project/suzhe.js'
]
```
## Options

| option | description | default | demo |
| :-----| ----: | :----: | :----: |
| cwd | project directory | '' | process.cwd() |
| entries | entry files | [] | [ './src/index.js' ] |
| includes | all files | ['\*\*/\*', '!node_modules'] | [ './src/\*\*/*' ] |
| resolveRequirePath | custom module path resolver | () => {} | (curDir, requirePath) => {} |


## License

MIT
