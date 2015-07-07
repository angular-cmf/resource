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
//# sourceMappingURL=LocalCacheList.js.map