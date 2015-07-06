/// <reference path='../_all.ts' />
var angularCmf;
(function (angularCmf) {
    var resource;
    (function (resource_1) {
        'use strict';
        var LocalCacheList = (function () {
            function LocalCacheList() {
            }
            /**
             * Registers a resource by its id or its pending uuid.
             *
             * @param resource
             */
            LocalCacheList.prototype.registerResource = function (resource) {
                if (_.isUndefined(resource.id)) {
                    this.list[resource.pendingUuid] = resource;
                }
                else {
                    this.list[resource.id] = resource;
                }
            };
            /**
             * Returns the complete list of registered resources.
             *
             * @returns {any[]}
             */
            LocalCacheList.prototype.getAll = function () {
                return this.list;
            };
            LocalCacheList.prototype.isRegistered = function (id) {
            };
            LocalCacheList.prototype.get = function (id) {
            };
            LocalCacheList.prototype.updateResource = function (resource) {
                if (_.isUndefined(this.list[resource.id])) {
                    throw new Error('Resource is not registered');
                }
                _.assign(this.list[resource.id], resource);
            };
            return LocalCacheList;
        })();
        resource_1.LocalCacheList = LocalCacheList;
        angular.module('angularCmf').service('LocalCacheList', LocalCacheList);
    })(resource = angularCmf.resource || (angularCmf.resource = {}));
})(angularCmf || (angularCmf = {}));
//# sourceMappingURL=LocalCacheList.js.map