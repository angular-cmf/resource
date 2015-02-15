angular.module('symfony-cmf-resource')
    .factory('ResourceService', ['Resource', 'Restangular', function(Resource, Restangular) {
        var ResourceService = {};
        ResourceService.$get = angular.noop;

        return ResourceService;
    }]);
