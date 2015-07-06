
function bla (Resource, $q) {
    var UnitOfWork = {};
    UnitOfWork.ResourcesList = {};
    UnitOfWork.$get = angular.noop;

    var removeTrailingSlash = function(str) {
        if (str.indexOf('/') === 0) {
            str = str.substring(1, str.length);
        }

        return str;
    };

    UnitOfWork.find = function(type, id) {
        var deferred = $q.defer(),
            cleanId = removeTrailingSlash(id);

        if (_.isUndefined(cleanId)) {
            deferred.reject(new Error('id must not be undefined.'));
        } else if (_.isUndefined(UnitOfWork.ResourcesList[cleanId])) {
            Resource
                .one(cleanId)
                .get()
                .then(function (resourceData) {
                    updateCachedList(resourceData);
                    deferred.resolve(UnitOfWork.ResourcesList[cleanId]);
                });
        } else {
            deferred.resolve(UnitOfWork.ResourcesList[cleanId]);
        }

        return deferred.promise;
    };

    UnitOfWork.persist = function (resource) {
        var deferred = $q.defer();

        resource.changed = true;

        // a newly created resource should be added to the local list only
        if (_.isUndefined(resource.id)) {
            addResourceToLocalList(resource);
        } else {
            updateCachedList(resource);
        }

        deferred.resolve(resource);

        return deferred.promise;
    };

    UnitOfWork.getAll = function () {
        return Resource.getList().then(function (resourceList) {
            _.each(resourceList, function (resource) {
                updateCachedList(resource);
            });

            return UnitOfWork.ResourcesList;
        });
    };

    function updateCachedList(resource) {
        if (_.isUndefined(UnitOfWork.ResourcesList[resource.id])) {
            UnitOfWork.ResourcesList[resource.id] = resource;
        } else {
            _.assign(UnitOfWork.ResourcesList[resource.id], resource);
        }
    }

    function addResourceToLocalList(resource) {
        resource.pendingUuid = guid();
        UnitOfWork.ResourcesList[resource.pendingUuid] = resource;
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    return UnitOfWork;
}
