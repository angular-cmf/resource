
angular.module('symfony-cmf-resource.config', ['restangular'])
    .config(function(RestangularProvider) {
        RestangularProvider.setEncodeIds(false);
        RestangularProvider.setBaseUrl('api');
    });
