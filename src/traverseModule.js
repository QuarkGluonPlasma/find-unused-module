const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const { resolve, dirname, join, extname } = require('path');
const fastGlob = require('fast-glob');
const chalk = require('chalk');
const postcss = require('postcss');
const postcssLess = require('postcss-less');
const postcssScss = require('postcss-scss');

const JS_EXTS = ['.js', '.jsx', '.ts', '.tsx'];
const CSS_EXTS = ['.css', '.less', '.scss'];

const MODULE_TYPES = {
    JS: 1 << 0,
    CSS: 1 << 1
};

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

    curModulePath = resolve(dirname(curModulePath), requirePath);
    return completeModulePath(curModulePath);
}

function completeModulePath (modulePath) {
    if (getModuleType(modulePath) & MODULE_TYPES.CSS) {
        return modulePath;
    }

    function tryCompletePath (resolvePath) {
        for (let i = 0; i < JS_EXTS.length; i ++) {
            let tryPath = resolvePath(JS_EXTS[i]);
            if (fs.existsSync(tryPath)) {
                return tryPath;
            }
        }
    }

    function reportModuleNotFoundError (modulePath) {
        throw chalk.red('module not found: ' + modulePath);
    }

    if (isDirectory(modulePath)) {
        const tryModulePath = tryCompletePath((ext) => join(modulePath, 'index' + ext));
        if (!tryModulePath) {
            reportModuleNotFoundError(modulePath);
        } else {
            return tryModulePath;
        }
    } else if (!JS_EXTS.some(ext => modulePath.endsWith(ext))) {
        const tryModulePath = tryCompletePath((ext) => modulePath + ext);
        if (!tryModulePath) {
            reportModuleNotFoundError(modulePath);
        } else {
            return tryModulePath;
        }
    }
    return modulePath;
}

function resolveBabelSyntaxtPlugins(modulePath) {
    const plugins = [];
    if (['.tsx', '.jsx'].some(ext => modulePath.endsWith(ext))) {
        plugins.push('jsx');
    }
    if (['.ts', '.tsx'].some(ext => modulePath.endsWith(ext))) {
        plugins.push('typescript');
    }
    return plugins;
}


function resolveBabelSyntaxtPlugins(modulePath) {
    const plugins = [];
    if (['.tsx', '.jsx'].some(ext => modulePath.endsWith(ext))) {
        plugins.push('jsx');
    }
    if (['.ts', '.tsx'].some(ext => modulePath.endsWith(ext))) {
        plugins.push('typescript');
    }
    return plugins;
}


function resolvePostcssSyntaxtPlugin(modulePath) {
    if (modulePath.endsWith('.scss')) {
        return postcssScss;
    }
    if (modulePath.endsWith('.less')) {
        return postcssLess;
    }
}

function getModuleType(modulePath) {
    const moduleExt = extname(modulePath);
     if (JS_EXTS.some(ext => ext === moduleExt)) {
         return MODULE_TYPES.JS;
     } else if (CSS_EXTS.some(ext => ext === moduleExt)) {
         return MODULE_TYPES.CSS;
     }
}

function traverseCssModule(curModulePath, callback) {
    const moduleFileConent = fs.readFileSync(curModulePath, {
        encoding: 'utf-8'
    });

    const ast = postcss.parse(moduleFileConent, {
        syntaxt: resolvePostcssSyntaxtPlugin(curModulePath)
    });
    ast.walkAtRules('import', rule => {
        const subModulePath = moduleResolver(curModulePath, rule.params.replace(/['"]/g, ''));
        if (!subModulePath) {
            return;
        }
        callback && callback(subModulePath);
        traverseModule(subModulePath, callback);
    })

}

function traverseJsModule(curModulePath, callback) {
    const moduleFileContent = fs.readFileSync(curModulePath, {
        encoding: 'utf-8'
    });

    const ast = parser.parse(moduleFileContent, {
        sourceType: 'unambiguous',
        plugins: resolveBabelSyntaxtPlugins(curModulePath)
    });

    traverse(ast, {
        ImportDeclaration(path) {
            const subModulePath = moduleResolver(curModulePath, path.get('source.value').node);
            if (!subModulePath) {
                return;
            }
            callback && callback(subModulePath);
            traverseModule(subModulePath, callback);
        }
    })
}

function traverseModule (curModulePath, callback) {
    curModulePath = completeModulePath(curModulePath);

    const moduleType = getModuleType(curModulePath);

    if (moduleType & MODULE_TYPES.JS) {
        traverseJsModule(curModulePath, callback);
    } else if (moduleType & MODULE_TYPES.CSS) {
        traverseCssModule(curModulePath, callback);
    } else {
        throw chalk.red(`unsupport module type:  ${curModulePath}, only support js and css module`);
    }    
}

module.exports = traverseModule;