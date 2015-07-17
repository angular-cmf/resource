(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path='../typings/angularjs/angular.d.ts' />
/// <reference path='../typings/restangular/restangular.d.ts' />
/// <reference path='services/LocalCacheList.ts' />
/// <reference path='services/PhpcrRestApiPersister.ts' />
/// <reference path='services/PersisterInterface.ts' />
/// <reference path='services/PhpcrRepoResource.ts' />
/// <reference path='services/IResource.ts' />
/// <reference path='services/IPhpcrOdmResource.ts' />
/// <reference path='services/IPhpcrResource.ts' />
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

},{}],5:[function(require,module,exports){
module.exports=require(4)
},{"/home/maximilian/OpenSource/Cmf/angular-cmf-resource/src/services/IPhpcrOdmResource.js":4}],6:[function(require,module,exports){
module.exports=require(4)
},{"/home/maximilian/OpenSource/Cmf/angular-cmf-resource/src/services/IPhpcrOdmResource.js":4}],7:[function(require,module,exports){
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
                this.list = {};
            }
            /**
             * Registers a resource by its id or its pending uuid.
             *
             * @param resource
             */
            LocalCacheList.prototype.registerResource = function (resource) {
                if (_.isString(resource.id)) {
                    if (!this.isRegistered(resource.id)) {
                        this.list[resource.id] = resource;
                        return true;
                    }
                    throw new Error('Problems while registering ' + resource.id + '. It is still registered with its id.');
                }
                else if (null !== resource.pendingUuid) {
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
             * Return all changed resources
             *
             * @returns {TResult[]}
             */
            LocalCacheList.prototype.getChangedResources = function () {
                return this.getResourcesBy('changed', true);
            };
            LocalCacheList.prototype.getRemovedResources = function () {
                return this.getResourcesBy('removed', true);
            };
            /**
             * Fetch a resource by a property and its value.
             *
             * @param property
             * @param value
             * @returns {Array}
             */
            LocalCacheList.prototype.getResourcesBy = function (property, value) {
                var resources = [];
                _.forEach(this.list, function (resource) {
                    if (resource[property] === value) {
                        resources.push(resource);
                    }
                });
                return resources;
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
            /**
             * Updates an existing resource.
             *
             * Those resources can be found by its pending uuid or its id.
             * When a resource with a pending uuid should be updated and has a id now, it will be registered with
             * its id then.
             *
             * @param resource
             * @returns {boolean}
             */
            LocalCacheList.prototype.updateResource = function (resource) {
                if (null !== resource.pendingUuid && null !== resource.id && typeof resource.pendingUuid !== 'undefined') {
                    if (this.isRegistered(resource.pendingUuid)) {
                        this.list[resource.id] = resource;
                        delete this.list[resource.pendingUuid];
                        return true;
                    }
                }
                else if (null !== resource.id) {
                    if (this.isRegistered(resource.id)) {
                        _.assign(this.list[resource.id], resource);
                        return true;
                    }
                }
                else if (null !== resource.pendingUuid) {
                    if (this.isRegistered(resource.pendingUuid)) {
                        _.assign(this.list[resource.pendingUuid], resource);
                        return true;
                    }
                }
                throw new Error('Problems while updating resource.');
            };
            /**
             * To remove a resource from the current list.
             *
             * @param resource
             */
            LocalCacheList.prototype.unregisterResource = function (resource) {
                resource.removed = true;
                return this.updateResource(resource);
            };
            /**
             * Removes a resource from the list of resources.
             *
             * @param resouce
             * @returns {boolean}
             */
            LocalCacheList.prototype.removeResource = function (resouce) {
                if (this.isRegistered(resouce.id)) {
                    delete this.list[resouce.id];
                    return true;
                }
                else if (this.isRegistered(resouce.pendingUuid)) {
                    delete this.list[resouce.pendingUuid];
                    return true;
                }
                return false;
            };
            return LocalCacheList;
        })();
        resource_1.LocalCacheList = LocalCacheList;
        angular.module('angularCmf').service('LocalCacheList', LocalCacheList);
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));

},{}],8:[function(require,module,exports){
module.exports=require(4)
},{"/home/maximilian/OpenSource/Cmf/angular-cmf-resource/src/services/IPhpcrOdmResource.js":4}],9:[function(require,module,exports){
/// <reference path='../_all.ts' />
var angularCmf;
(function (angularCmf) {
    var resource;
    (function (resource) {
        var PhpcrRepoResource = (function () {
            function PhpcrRepoResource(Restangular) {
                this.Restangular = Restangular;
            }
            PhpcrRepoResource.instance = function (Restangular) {
                var instance;
                instance = Restangular.service('phpcr_repo');
                instance['$get'] = angular.noop;
                instance['changed'] = false;
                instance['removed'] = false;
                instance['pendingUuid'] = null;
                instance['id'] = null;
                return instance;
            };
            PhpcrRepoResource.$inject = ['Restangular'];
            return PhpcrRepoResource;
        })();
        resource.PhpcrRepoResource = PhpcrRepoResource;
        angular.module('angularCmf').factory('PhpcrRepoResource', PhpcrRepoResource.instance);
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));

},{}],10:[function(require,module,exports){
/// <reference path='../_all.ts' />
var angularCmf;
(function (angularCmf) {
    var resource;
    (function (resource_1) {
        'use strict';
        var PhpcrRestApiPersister = (function () {
            function PhpcrRestApiPersister(resource, restangular) {
                this.Resource = resource;
                this.Restangular = restangular;
            }
            PhpcrRestApiPersister.prototype.get = function (id) {
                return this.Resource.one(id).get();
            };
            PhpcrRestApiPersister.prototype.save = function (resource) {
                if (!_.isUndefined(resource.id)) {
                    return resource.put();
                }
                else {
                    return this.Resource.post(resource);
                }
            };
            PhpcrRestApiPersister.prototype.getAll = function () {
                return this.Resource.getList();
            };
            PhpcrRestApiPersister.prototype.remove = function (resource) {
                if (null === resource.id && null !== resource.pendingUuid) {
                    throw new Error('Can\'t remove the resource at the api - does not exists. (pending uuid set)');
                }
                return resource.remove();
            };
            PhpcrRestApiPersister.$inject = ['PhpcrRepoResource', 'Restangular'];
            return PhpcrRestApiPersister;
        })();
        resource_1.PhpcrRestApiPersister = PhpcrRestApiPersister;
        angular.module('angularCmf').service('PhpcrRestApiPersister', PhpcrRestApiPersister);
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));

},{}],11:[function(require,module,exports){
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
                return this.Persister.get(cleanId).then(function (resource) {
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
                if (this.CacheList.unregisterResource(resource)) {
                    deferred.resolve(resource);
                }
                else {
                    deferred.reject(new Error('Can\'t unregister the resource.'));
                }
                return deferred.promise;
            };
            UnitOfWork.prototype.flush = function () {
                var _this = this;
                var promises = [];
                _.each(this.CacheList.getChangedResources(), function (resource) {
                    promises.push(_this.Persister.save(resource).then(function (data) {
                        resource.changed = false;
                        _.assign(resource, data);
                        return _this.CacheList.updateResource(resource);
                    }));
                });
                _.each(this.CacheList.getRemovedResources(), function (resource) {
                    promises.push(_this.Persister.remove(resource).then(function (data) {
                        return _this.CacheList.removeResource(resource);
                    }));
                });
                return this.$q.all(promises).then(function () { return true; }, function () { return false; });
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
            UnitOfWork.$inject = ['PhpcrRestApiPersister', 'LocalCacheList', '$q'];
            return UnitOfWork;
        })();
        angular.module('angularCmf').service('UnitOfWork', UnitOfWork);
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));

},{}],12:[function(require,module,exports){
/// <resource path='../_all.ts' />

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12]);
