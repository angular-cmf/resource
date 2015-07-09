/// <reference path='_all.ts' />

angular.module('angularCmf.config', ['restangular'])
    .config(function(RestangularProvider) {
        RestangularProvider.setEncodeIds(false);
        RestangularProvider.setBaseUrl('api');
    });
