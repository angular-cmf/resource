module.exports = function(config){
    'use strict';

    config.set({

        basePath: '../',

        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/lodash/dist/lodash.min.js',
            'bower_components/restangular/dist/restangular.js',

            'src/app.js',
            'src/app.config.js',
            'src/**/*.js',
            'src/*.js',

            'tests/fakeApi/*.js',

            'tests/unit/**/*.js',
            'tests/integration/*.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Firefox'],

        plugins: [
            'karma-firefox-launcher',
            'karma-story-reporter',
            'karma-jasmine'
        ],

        reporters: ['story'],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }
    });
};
