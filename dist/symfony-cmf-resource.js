(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('symfony-cmf-resource')
    .factory('Resource', ['Restangular', function(Restangular) {
        var Resource = Restangular.service('resources');
        Resource.$get = angular.noop;

        return Resource;
    }]);

},{}],2:[function(require,module,exports){
angular.module('symfony-cmf-resource')
    .factory('ResourceService', ['Resource', 'Restangular', function(Resource, Restangular) {
        var ResourceService = {};
        ResourceService.$get = angular.noop;

        return ResourceService;
    }]);

},{}],3:[function(require,module,exports){

angular.module('symfony-cmf-resource.config', ['restangular']);

},{}],4:[function(require,module,exports){

angular.module('symfony-cmf-resource', ['symfony-cmf-resource.config']);

},{}]},{},[1,2,3,4]);