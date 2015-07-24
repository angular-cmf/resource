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
            'PhpcrRestApiPersister',
            function (persisterChainProvider: angularCmf.resource.persisterChain, PhpcrRestApiPersister) {
                persisterChainProvider.addPersister(PhpcrRestApiPersister);
            }]);
}
