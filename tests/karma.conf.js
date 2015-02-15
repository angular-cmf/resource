module.exports = function(config){
    config.set({

        basePath : '../',

        files : [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/lodash/dist/lodash.min.js',
            'bower_components/restangular/dist/restangular.js',

            'src/app.js',
            'src/app.config.js',
            'src/**/*.js',

            'tests/unit/**/*.js'
        ],

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS', 'Chrome'],

        plugins : [
            'karma-chrome-launcher',
            'karma-story-reporter',
            'karma-jasmine',
            'karma-phantomjs-launcher'
        ],

        reporters: ['story'],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }
    });
};
