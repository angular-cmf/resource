angular.module('symfony-cmf-resource')
    .factory('Resource', ['Restangular', function(Restangular) {
        var Resource = Restangular.service('phpcr_repo');
        Resource.$get = angular.noop;

        return Resource;
    }]);
