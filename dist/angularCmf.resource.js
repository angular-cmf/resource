(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path='../typings/angularjs/angular.d.ts' />
/// <reference path='../typings/restangular/restangular.d.ts' />
/// <reference path='services/LocalCacheList.ts' />
/// <reference path='services/CmfRestApiPersister.ts' />
/// <reference path='services/PersisterInterface.ts' />
/// <reference path='services/Resource.ts' />
/// <reference path='services/UnitOfWorkInterface.ts' />
/// <reference path='services/UnitOfWork.ts' />
/// <reference path='app.config.ts' />

},{}],2:[function(require,module,exports){
/// <reference path='_all.ts' />
angular.module('angularCmf.config', ['restangular'])
    .config(function (RestangularProvider) {
    RestangularProvider.setEncodeIds(false);
    RestangularProvider.setBaseUrl('api');
});

},{}],3:[function(require,module,exports){
/// <reference path='_all.ts' />
/**
 * The main application file
 *
 * @todo Remove cause its a lib
 *
 * @type {angular.Module}
 */
var angularCmf;
(function (angularCmf) {
    var resource;
    (function (resource) {
        'use strict';
        var resourceLibrary = angular
            .module('angularCmf', ['angularCmf.config']);
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));

},{}],4:[function(require,module,exports){
/// <reference path='../_all.ts' />
var angularCmf;
(function (angularCmf) {
    var resource;
    (function (resource_1) {
        'use strict';
        var CmfRestApiPersister = (function () {
            function CmfRestApiPersister(resource) {
                this.Resource = resource;
            }
            CmfRestApiPersister.prototype.get = function (id) {
                return this.Resource.one(id).get();
            };
            CmfRestApiPersister.prototype.save = function (resource) {
            };
            CmfRestApiPersister.prototype.getAll = function () {
                return this.Resource.getList();
            };
            CmfRestApiPersister.prototype.remove = function (resource) {
            };
            CmfRestApiPersister.$inject = ['Resource'];
            return CmfRestApiPersister;
        })();
        resource_1.CmfRestApiPersister = CmfRestApiPersister;
        angular.module('angularCmf').service('CmfRestApiPersister', CmfRestApiPersister);
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));

},{}],5:[function(require,module,exports){
/// <reference path='../_all.ts' />
var angularCmf;
(function (angularCmf) {
    var resource;
    (function (resource_1) {
        'use strict';
        var LocalCacheList = (function () {
            function LocalCacheList() {
                /**
                 * the list of all registered resources
                 */
                this.list = [];
            }
            /**
             * Registers a resource by its id or its pending uuid.
             *
             * @param resource
             */
            LocalCacheList.prototype.registerResource = function (resource) {
                if (null === resource.pendingUuid && null !== resource.id) {
                    if (!this.isRegistered(resource.id)) {
                        this.list[resource.id] = resource;
                        return true;
                    }
                    throw new Error('Problems while registering ' + resource.id + '. It is still registered with its id.');
                }
                else if (null !== resource.pendingUuid && null === resource.id) {
                    if (!this.isRegistered(resource.pendingUuid)) {
                        this.list[resource.pendingUuid] = resource;
                        return true;
                    }
                    throw new Error('Problems while registering ' + resource.pendingUuid + '. It is still registered with its pending uuid.');
                }
                throw new Error('Problems while registering resource. Id nor uuid is set.');
            };
            /**
             * Returns the complete list of registered resources.
             *
             * @returns {any[]}
             */
            LocalCacheList.prototype.getAll = function () {
                return this.list;
            };
            /**
             * Checks whether the resource is registered. The registration can done by its id or an uuid.
             * @param id
             *
             * @returns {boolean}
             */
            LocalCacheList.prototype.isRegistered = function (id) {
                return !_.isUndefined(this.list[id]);
            };
            /**
             * @param id
             *
             * @returns {*}
             */
            LocalCacheList.prototype.get = function (id) {
                if (this.isRegistered(id)) {
                    return this.list[id];
                }
                return null;
            };
            LocalCacheList.prototype.updateResource = function (resource) {
                if (null === resource.pendingUuid && null !== resource.id) {
                    if (this.isRegistered(resource.id)) {
                        _.assign(this.list[resource.id], resource);
                        return true;
                    }
                }
                else if (null !== resource.pendingUuid && null === resource.id) {
                    if (this.isRegistered(resource.pendingUuid)) {
                        _.assign(this.list[resource.pendingUuid], resource);
                        return true;
                    }
                }
                throw new Error('Problems while updating resource.');
            };
            return LocalCacheList;
        })();
        resource_1.LocalCacheList = LocalCacheList;
        angular.module('angularCmf').service('LocalCacheList', LocalCacheList);
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));

},{}],6:[function(require,module,exports){
/// <reference path='../_all.ts' />

},{}],7:[function(require,module,exports){
/// <reference path='../_all.ts' />
var angularCmf;
(function (angularCmf) {
    var resource;
    (function (resource) {
        var Resource = (function () {
            function Resource(Restangular) {
                this.Restangular = Restangular;
            }
            Resource.instance = function (Restangular) {
                var instance;
                instance = Restangular.service('phpcr_repo');
                instance['$get'] = angular.noop;
                instance['changed'] = false;
                instance['pendingUuid'] = null;
                return instance;
            };
            Resource.$inject = ['Restangular'];
            return Resource;
        })();
        resource.Resource = Resource;
        angular.module('angularCmf').factory('Resource', Resource.instance);
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));

},{}],8:[function(require,module,exports){
/// <reference path='../_all.ts' />
var angularCmf;
(function (angularCmf) {
    var resource;
    (function (resource_1) {
        'use strict';
        var UnitOfWork = (function () {
            function UnitOfWork(persister, cacheList, $q) {
                this.Persister = persister;
                this.CacheList = cacheList;
                this.$q = $q;
            }
            UnitOfWork.prototype.find = function (id) {
                var _this = this;
                var deferred = this.$q.defer();
                if (!_.isString(id)) {
                    deferred.reject(new Error('id must be a string.'));
                    return deferred.promise;
                }
                var cleanId = this.removeTrailingSlash(id);
                if (this.CacheList.isRegistered(cleanId)) {
                    deferred.resolve(this.CacheList.get(cleanId));
                    return deferred.promise;
                }
                // get a fresh resource from the persister
                return this.Persister.get(id).then(function (resource) {
                    _this.CacheList.registerResource(resource);
                    return resource;
                });
            };
            UnitOfWork.prototype.persist = function (resource) {
                var deferred = this.$q.defer();
                resource.changed = true;
                // a newly created resource should be added to the local list only
                if (!this.CacheList.isRegistered(resource.id)) {
                    resource.pendingUuid = this.guid();
                    this.CacheList.registerResource(resource);
                }
                else {
                    this.CacheList.updateResource(resource);
                }
                deferred.resolve(resource);
                return deferred.promise;
            };
            UnitOfWork.prototype.remove = function (resource) {
                var deferred = this.$q.defer();
                return deferred.promise;
            };
            UnitOfWork.prototype.flush = function () {
                var deferred = this.$q.defer();
                return deferred.promise;
            };
            UnitOfWork.prototype.findAll = function () {
                var _this = this;
                return this.Persister.getAll().then(function (resourceList) {
                    _.each(resourceList, function (resource) {
                        _this.CacheList.updateResource(resource);
                    });
                    return _this.CacheList.getAll();
                });
            };
            UnitOfWork.prototype.removeTrailingSlash = function (str) {
                if (str.indexOf('/') === 0) {
                    str = str.substring(1, str.length);
                }
                return str;
            };
            UnitOfWork.prototype.guid = function () {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };
            UnitOfWork.$inject = ['CmfRestApiPersister', 'LocalCacheList', '$q'];
            return UnitOfWork;
        })();
        angular.module('angularCmf').service('UnitOfWork', UnitOfWork);
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));

},{}],9:[function(require,module,exports){
/// <resource path='../_all.ts' />

},{}]},{},[1,2,3,4,5,6,7,8,9]);