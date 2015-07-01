angular.module('angular-cmf-resource')
    .factory('Resource', ['Restangular', function(Restangular) {
        var Resource = Restangular.service('phpcr_repo');
        Resource.$get = angular.noop;
        Resource.changed = false;
        Resource.pendingUuid = null;

        return Resource;
    }]);
