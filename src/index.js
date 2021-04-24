const { resolve } = require('path');
const fastGlob = require('fast-glob');
const traverseModule = require('./traverseModule');

const defaultOptions = {
    entries: [],
    includes: ['**/*']
}

function findUnusedModule (options) {
    const {
        entries,
        includes
    } = Object.assign(defaultOptions, options);

    const allFiles = fastGlob.sync(includes);
    const entryModules = [];
    const usedModules = [];

    entries.forEach(entry => {
        const entryPath = resolve(entry);
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
