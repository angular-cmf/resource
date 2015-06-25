
angular.module('angular-cmf-resource.config', ['restangular'])
    .config(function(RestangularProvider) {
        RestangularProvider.setEncodeIds(false);
        RestangularProvider.setBaseUrl('api');
    });
