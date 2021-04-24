const { resolve } = require('path');
const fastGlob = require('fast-glob');
const traverseModule = require('./traverseModule');

const defaultOptions = {
    cwd: '',
    entries: [],
    includes: ['**/*', '!node_modules']
}

function findUnusedModule (options) {
    let {
        cwd,
        entries,
        includes
    } = Object.assign(defaultOptions, options);

    includes = includes.map(includePath => (cwd ? `${cwd}/${includePath}` : includePath));

    const allFiles = fastGlob.sync(includes);
    const entryModules = [];
    const usedModules = [];

    entries.forEach(entry => {
        const entryPath = resolve(cwd, entry);
        entryModules.push(entryPath);
        traverseModule(entryPath, (modulePath) => {
            usedModules.push(modulePath);
        });
    });

    const unusedModules = allFiles.filter(filePath => {
        const resolvedFilePath = resolve(filePath);
        return !entryModules.includes(resolvedFilePath) && !usedModules.includes(resolvedFilePath);
    });
    return {
        all: allFiles,
        used: usedModules,
        unused: unusedModules
    }
}

module.exports = findUnusedModule;
