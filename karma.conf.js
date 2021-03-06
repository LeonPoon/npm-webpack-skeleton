// Karma configuration

const webpack           = require('webpack');
const webpackConfig = require('./webpack.config.js');

webpackConfig.plugins = webpackConfig.plugins.filter(x => !(x instanceof webpack.optimize.CommonsChunkPlugin));
delete webpackConfig.entry;

const files = [
  'src/**/*.spec.ts',
  'src/**/*.spec.js',
  'src/**/*.spec.jsx',
  'src/**/*.spec.tsx',
];

module.exports = function(config) {
  config.set({
    webpack: webpackConfig,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    mime: {
        "text/x-typescript": ["ts", "tsx"]
    },

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    plugins: [
      require('karma-sourcemap-loader'),
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
    ],

    // list of files / patterns to load in the browser
    files,


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: files.reduce((files, file) => (files[file] = ['webpack', 'sourcemap'], files), {}),


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
