/// <reference path='_all.ts' />
/**
 * The main application file
 *
 * @todo Remove cause its a lib
 *
 * @type {angular.Module}
 */
var angularCmf;
(function (angularCmf) {
    var resource;
    (function (resource) {
        'use strict';
        var resourceLibrary = angular
            .module('angularCmf', ['angularCmf.config']);
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));
