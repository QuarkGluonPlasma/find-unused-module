const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const { resolve, dirname, join } = require('path');

const aliasMap = {
    'a': './lib/ssh.js'
}

function isDirectory(filePath) {
    try {
        return fs.statSync(filePath).isDirectory()
    }catch(e) {}
    return false;
}

function moduleResolver (curModulePath, requirePath) {
    if (aliasMap[requirePath]) {
        requirePath = aliasMap[requirePath];
    }
    // 过滤掉第三方模块
    if (!requirePath.startsWith('.')) {
        return '';
    }

    return resolve(dirname(curModulePath), requirePath);
}

function getUsedModules (curModulePath, callback) {
    if (isDirectory(curModulePath)) {
        curModulePath = join(curModulePath, 'index.js');
    } else if (!curModulePath.endsWith('.js')) {
        curModulePath += join(curModulePath, '.js');
    }

    const moduleFile = fs.readFileSync(curModulePath, {
        encoding: 'utf-8'
    });

    const ast = parser.parse(moduleFile, {
        sourceType: 'unambiguous',
        plugins: ['jsx'] // typescript
    });

    traverse(ast, {
        ImportDeclaration(path) {
            const subModulePath = moduleResolver(curModulePath, path.get('source.value').node);
            if (!subModulePath) {
                return;
            }
            callback && callback(subModulePath);
            getUsedModules(subModulePath, callback);
        }
    })
}

getUsedModules(resolve('./demo-project/fre.js'), (modulePath) => {
    console.log(modulePath);
});
