const path = require('path');
const env = require('dotenv').config({ path: path.join(__dirname, `${process.env.NODE_ENV}.env`) });
const { DefinePlugin } = require('webpack');
const build = require('./src/build');

module.exports = {
    entry: './src/index.js',
    plugins: [
        // Hook in the commands build process before each webpack run
        { apply: compiler => compiler.hooks.beforeRun.tapPromise('PrepareBuildBeforeWebpack', build) },
    ]
};
