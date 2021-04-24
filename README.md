scan unused module under some dir, support js、ts、jsx、tsx、css、less、scss、json extname , esm、commonjs js module and @import css module.

support extname:
- [x] js
- [x] jsx
- [x] ts
- [x] tsx
- [x] css
- [x] less
- [x] scss
- [x] json

support module require:
- [x] es module: import
- [x] commonjs: require 
- [x] css、less、scss: @import

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
const { resolve } = require('path');

const { all, used, unused } = findUnusedModule({
    cwd: process.cwd(),
    entries: ['./demo-project/fre.js', './demo-project/suzhe2.js'],
    includes: ['./demo-project/**/*']
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
  '/xxx/find-unused-module/demo-project/render.js',
  '/xxx/find-unused-module/demo-project/diff.js',
  '/xxx/find-unused-module/demo-project/dom.js',
  '/xxx/find-unused-module/demo-project/h.js',
  '/xxx/find-unused-module/demo-project/component.js',
  '/xxx/find-unused-module/demo-project/set-state-queue.js',
  '/xxx/find-unused-module/demo-project/diff.js',
  '/xxx/find-unused-module/demo-project/dom.js',
  '/xxx/find-unused-module/demo-project/watcher.js',
  '/xxx/find-unused-module/demo-project/dep.js',
  '/xxx/find-unused-module/demo-project/diff.js',
  '/xxx/find-unused-module/demo-project/dom.js',
  '/xxx/find-unused-module/demo-project/observer.js',
  '/xxx/find-unused-module/demo-project/dep.js',
  '/xxx/find-unused-module/demo-project/lib/ssh.js',
  '/xxx/find-unused-module/demo-project/guang.tsx',
  '/xxx/find-unused-module/demo-project/style.css',
  '/xxx/find-unused-module/demo-project/styles/common.css',
  '/xxx/find-unused-module/demo-project/style2.less',
  '/xxx/find-unused-module/demo-project/styles/common2.less',
  '/xxx/find-unused-module/demo-project/style3.scss',
  '/xxx/find-unused-module/demo-project/styles/common3.scss'
]
unused modules:
[ './demo-project/suzhe.js' ]
```
## Options

| option | description | default | demo |
| :-----| ----: | :----: | :----: |
| cwd | project directory | '' | process.cwd() |
| entries | entry files | [] | [ './src/index.js' ] |
| includes | all files | ['\*\*/\*', '!node_modules'] | [ './src/\*\*/*' ] |

## License

MIT
