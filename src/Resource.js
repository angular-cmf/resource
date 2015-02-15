angular.module('symfony-cmf-resource')
    .factory('Resource', ['Restangular', function(Restangular) {
        var Resource = Restangular.service('resources');
        Resource.$get = angular.noop;

        return Resource;
    }]);
