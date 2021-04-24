const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const { resolve, dirname, join } = require('path');

const EXTS = ['.js', '.jsx', '.ts', '.tsx'];

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

function completeModulePath (modulePath) {

    function tryCompletePath (resolvePath) {
        for (let i = 0; i < EXTS.length; i ++) {
            let tryPath = resolvePath(EXTS[i]);
            if (fs.existsSync(tryPath)) {
                return tryPath;
            }
        }
    }

    function reportModuleNotFoundError (modulePath) {
        throw new Error('没找到模块 ' + modulePath);
    }

    if (isDirectory(modulePath)) {
        const tryModulePath = tryCompletePath((ext) => join(modulePath, 'index' + ext));
        if (!tryModulePath) {
            reportModuleNotFoundError(modulePath);
        } else {
            return tryModulePath;
        }
    } else if (!EXTS.some(ext => modulePath.endsWith(ext))) {
        const tryModulePath = tryCompletePath((ext) => modulePath + ext);
        if (!tryModulePath) {
            reportModuleNotFoundError(modulePath);
        } else {
            return tryModulePath;
        }
    }
    return modulePath;
}

function resolveSyntaxtPlugins(modulePath) {
    const plugins = [];
    if (['.tsx', '.jsx'].some(ext => modulePath.endsWith(ext))) {
        plugins.push('jsx');
    }
    if (['.ts', '.tsx'].some(ext => modulePath.endsWith(ext))) {
        plugins.push('typescript');
    }
    return plugins;
}

function getUsedModules (curModulePath, callback) {
    curModulePath = completeModulePath(curModulePath);

    const moduleFile = fs.readFileSync(curModulePath, {
        encoding: 'utf-8'
    });

    const ast = parser.parse(moduleFile, {
        sourceType: 'unambiguous',
        plugins: resolveSyntaxtPlugins(curModulePath)
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
