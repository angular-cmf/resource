/// <reference path='_all.ts' />

/**
 * The main application file
 *
 * @todo Remove cause its a lib
 *
 * @type {angular.Module}
 */
module angularCmf.resource {
    'use strict';

    angular
        .module('angularCmf', ['restangular'])
        .config(function(RestangularProvider) {
            RestangularProvider.setEncodeIds(false);
            RestangularProvider.setBaseUrl('api');
        })
        .config([
            'persisterChainProvider',
            function (persisterChainProvider: angularCmf.resource.persisterChain) {
                persisterChainProvider.addPersisterById('PhpcrRestApiPersister');
            }]);
}
